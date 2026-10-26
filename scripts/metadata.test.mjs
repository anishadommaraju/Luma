import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const paperDir=path.join(root,'papers');
const metadata=JSON.parse(fs.readFileSync(path.join(paperDir,'metadata.json'),'utf8'));
const allowedPopulations=new Set(['pediatric','adolescent','adult','mixed']);

test('every research PDF has complete population and audience metadata',()=>{
 const pdfs=fs.readdirSync(paperDir).filter(name=>name.toLowerCase().endsWith('.pdf')).sort();
 assert.deepEqual(Object.keys(metadata).sort(),pdfs);
 for(const filename of pdfs){
  const entry=metadata[filename];
  for(const field of ['population','topic','evidence_type','audience','year'])assert.equal(typeof entry[field],'string',`${filename} is missing ${field}`);
  assert.ok(allowedPopulations.has(entry.population),`${filename} has invalid population ${entry.population}`);
  assert.match(entry.year,/^\d{4}$/,`${filename} has an invalid year`);
 }
});
