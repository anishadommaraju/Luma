import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=new URL('../',import.meta.url);
export function localCitationMetadata(fileId){
 try{
  const state=JSON.parse(fs.readFileSync(new URL('.rag/ingestion.json',root),'utf8'));
  const entries=state.stores[process.env.OPENAI_VECTOR_STORE_ID||state.lastVectorStoreId]||{};
  const match=Object.entries(entries).find(([,v])=>v.fileId===fileId);
  if(!match)return {};
  const [hash,entry]=match; const metadata=JSON.parse(fs.readFileSync(new URL('papers/metadata.json',root),'utf8'));
  if(!entry.filename||!metadata[entry.filename])return {};
  const file=new URL('papers/'+entry.filename,root);
  if(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==hash)return {};
  return metadata[entry.filename];
 }catch{return {}}
}
export function sourceDetails(id,hits,annotations,metadata={}){
 const r=hits[0];const attrs=r.attributes||{};
 const clean=v=>typeof v==='string'&&v.trim()?v.trim():null;
 const filename=clean(r.filename)||clean(annotations.find(a=>a.file_id===id)?.filename)||'Filename unavailable';
 const title=clean(metadata.title)||clean(attrs.title)||filename;
 const yearValue=clean(metadata.year)||clean(attrs.year);const year=/^\d{4}$/.test(yearValue||'')?yearValue:null;
 const authors=Array.isArray(metadata.authors)?metadata.authors.filter(a=>typeof a==='string'&&a.trim()):[];
 const authorLabel=clean(metadata.citation_author)||(authors.length?authors[0]+(authors.length>1?' et al.':''):null);
 const label=authorLabel&&year?`${authorLabel} (${year}) — ${title}`:title;
 const url=clean(metadata.source_url)||clean(attrs.source_url);
 return {fileId:id,filename,title,year,authors,label,url:/^https:\/\/(pmc\.ncbi\.nlm\.nih\.gov|doi\.org)\//.test(url||'')?url:null,excerpts:[...new Set(hits.map(h=>h.text))]};
}
