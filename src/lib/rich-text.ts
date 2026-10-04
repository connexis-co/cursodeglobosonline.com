import GithubSlugger from 'github-slugger';
import { plainText, type RichBlock } from './emdash-content';
export function richHeadings(blocks:RichBlock[]){const slugger=new GithubSlugger();return blocks.filter(b=>b._type==='block'&&/^h[1-6]$/.test(String(b.style))).map(b=>({depth:Number(String(b.style).slice(1)),text:plainText(b.children),slug:slugger.slug(plainText(b.children))}));}
