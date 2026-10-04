import {definePlugin} from 'emdash';

/** Preserve the real editorial author instead of core's name-only Person fallback. */
export function createPlugin(){
 return definePlugin({id:'globos-seo',version:'1.0.0',capabilities:[],hooks:{
  'page:metadata':async({page})=>{
   if(page.pageType!=='article'||page.content?.collection!=='blog'||!page.canonical)return null;
   const {getEntry,getAuthor,getBlogCluster}=await import('@/lib/emdash-content');
   const {blogPostingSchema}=await import('@/lib/seo');
   const post=await getEntry('blog',page.content.id);if(!post)return null;
   const d=post.data;
   const [author,cluster]=await Promise.all([getAuthor(d.author),getBlogCluster(d.cluster)]);
   const graph=blogPostingSchema({url:page.canonical,headline:page.seo?.ogTitle||d.title,
    description:page.description||d.description,images:[new URL(page.image||d.hero.src,page.siteUrl).href],
    datePublished:d.publishedAt,dateModified:d.updatedAt??d.publishedAt,author,section:cluster.name,
    keywords:d.keywords,wordCount:post.body?.split(/\s+/).filter(Boolean).length});
   return {kind:'jsonld',id:'primary',graph};
  },
 }});
}
