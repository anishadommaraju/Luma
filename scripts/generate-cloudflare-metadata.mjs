import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'papers','metadata.json'),'utf8'));
const safe=Object.fromEntries(Object.entries(source).map(([filename,value])=>[filename,{
  title:value.title,
  year:value.year,
  authors:Array.isArray(value.authors)?value.authors:[],
  citation_author:value.citation_author,
  source_url:value.source_url,
}]));
const target=path.join(root,'cloudflare','citation-metadata.generated.js');
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,`// Generated from papers/metadata.json by npm run prepare:cloudflare.\nexport default ${JSON.stringify(safe,null,2)};\n`);
