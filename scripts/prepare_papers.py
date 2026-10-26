from pathlib import Path
import json,shutil
root=Path('../OCD_Knowledge_Base'); dest=Path('papers');dest.mkdir(exist_ok=True)
meta={}
for r in json.loads((root/'sources.json').read_text(encoding='utf-8')):
 if not r.get('canonical_for_retrieval',True):continue
 f=Path(r['pdf_file']);shutil.copy2(root/f,dest/f.name)
 title=r['title']; lower=title.lower()
 evidence='systematic review/meta-analysis' if ('meta-analysis' in lower or 'systematic review' in lower) else 'clinical guideline' if 'guideline' in lower else 'review' if ('review' in lower or 'perspectives' in lower or r['pmcid'] in ['PMC7370844','PMC11170287','PMC2847172','PMC4011018','PMC4994744','PMC9041967']) else 'individual research study'
 meta[f.name]={'title':title,'year':r['publication_date'][:4],'topic':f.parts[0].split('_',1)[1],'evidence_type':evidence,'retrieval_group':r['retrieval_group'],'source_url':r['source_url'],'pmcid':r['pmcid'],'edition':'generated text reading copy'}
(dest/'metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Prepared {len(meta)} curated PDFs; duplicate primer excluded.')
