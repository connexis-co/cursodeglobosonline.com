import { markdownToPortableText } from 'emdash/client';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import {normalizePortableTextTable} from '@emdash-cms/admin/portable-text-table';
export function migrateBody(source:string):Record<string,unknown>[] {
 let cleaned=source.replace(/<CourseCta\s+([^>]*?)\s*\/>/g,(_,attrs:string)=>{
  const course=attrs.match(/curso="([^"]+)"/)?.[1]??'catalogo';const text=attrs.match(/texto="([^"]+)"/)?.[1]??'Ver el curso';
  return `\n\n[${text}](${course==='catalogo'?'/co/cursos/':`/co/${course}/`})\n\n`;
 }).replace(/<Callout\s+([^>]*?)>([\s\S]*?)<\/Callout>/g,(_,attrs:string,body:string)=>{
  const title=attrs.match(/titulo="([^"]+)"/)?.[1]??'';return '\n\n'+(`**${title}**\n\n${body.trim()}`).split('\n').map(l=>'> '+l).join('\n')+'\n\n';
 });
 if(/<(?:CourseCta|Callout)\b/.test(cleaned))throw Error('Unmapped MDX component');
 // Use the Markdown AST to identify tables (including escaped pipes) and paragraph wrapping.
 const tree=unified().use(remarkParse).use(remarkGfm).parse(cleaned);
 const replacements:Array<{start:number;end:number;text:string}>=[];let tableKey=0;
 for(const node of tree.children){
  if(node.type==='paragraph'){const raw=cleaned.slice(node.position!.start.offset!,node.position!.end.offset!);replacements.push({start:node.position!.start.offset!,end:node.position!.end.offset!,text:raw.replace(/(?<!  )\n/g,' ')});}
  if(node.type!=='table')continue;
  const raw={_type:'table',_key:`t${tableKey++}`,hasHeaderRow:true,rows:node.children.map((row,ri)=>({_type:'tableRow',_key:`r${tableKey++}`,cells:row.children.map((cell,ci)=>{
   const md=cleaned.slice(cell.position!.start.offset!,cell.position!.end.offset!);const block=markdownToPortableText(md)[0] as any;
   return {_type:'tableCell',_key:`c${tableKey++}`,content:block?.children??[{_type:'span',_key:`s${tableKey++}`,text:'',marks:[]}],markDefs:block?.markDefs??[],isHeader:ri===0,...(node.align?.[ci]?{textAlign:node.align[ci]}:{})};
  })}))};
  const normalized=normalizePortableTextTable(raw,{path:'migration',createKey:()=>`t${tableKey++}`});if(!normalized.ok)throw Error('Table migration failed: '+normalized.reason);
  replacements.push({start:node.position!.start.offset!,end:node.position!.end.offset!,text:'<!--ec:block '+JSON.stringify(normalized.table)+' -->'});
 }
 for(const r of replacements.sort((a,b)=>b.start-a.start))cleaned=cleaned.slice(0,r.start)+r.text+cleaned.slice(r.end);
 const blocks=markdownToPortableText(cleaned) as unknown as Record<string,unknown>[];
 let index=0;const keys=new Map<string,string>();
 function visit(v:unknown){if(!v||typeof v!=='object')return;for(const [key,value] of Object.entries(v)){if(key==='_key'&&typeof value==='string')keys.set(value,`g${index++}`);else visit(value);}}
 visit(blocks);return JSON.parse(JSON.stringify(blocks,(key,value)=>key==='_key'?keys.get(value)??value:key==='marks'?value.map((m:string)=>keys.get(m)??m):value));
}
