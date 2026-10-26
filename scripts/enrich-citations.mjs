import fs from 'node:fs';
let s=fs.readFileSync('server/rag.mjs','utf8');s="import {localCitationMetadata,sourceDetails} from './citations.mjs';\n"+s;
s=s.replace(/const source=\(id\)=>\{.*?\};/,"const source=(id)=>sourceDetails(id,retrieved.filter(r=>r.file_id===id),citations,localCitationMetadata(id));");fs.writeFileSync('server/rag.mjs',s);
const meta=JSON.parse(fs.readFileSync('papers/metadata.json','utf8'));const sources=JSON.parse(fs.readFileSync('evidence/sources.json','utf8'));for(const m of Object.values(meta)){const r=sources.find(r=>r.pmcid===m.pmcid);if(r)m.authors=r.authors;if(m.pmcid==='PMC7370844')m.citation_author='Stein et al.'}fs.writeFileSync('papers/metadata.json',JSON.stringify(meta,null,2)+'\n');
