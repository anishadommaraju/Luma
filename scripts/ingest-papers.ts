import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {api,projectRoot} from '../server/openai.mjs';
const dir=path.join(projectRoot,'papers'),cacheDir=path.join(projectRoot,'.rag'),statePath=path.join(cacheDir,'ingestion.json');
fs.mkdirSync(cacheDir,{recursive:true});
const lock=path.join(cacheDir,'ingestion.lock');
let locked=false;
function writeState(s:any){const tmp=statePath+'.tmp';fs.writeFileSync(tmp,JSON.stringify(s,null,2));fs.renameSync(tmp,statePath)}
function pdfs(dir:string):string[]{return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pdfs(path.join(dir,e.name)):e.isFile()&&/\.pdf$/i.test(e.name)?[path.join(dir,e.name)]:[])}
async function main(){
 try{fs.writeFileSync(lock,String(process.pid),{flag:'wx'});locked=true}catch{throw Error('Another ingestion may be running. If it stopped unexpectedly, remove .rag/ingestion.lock before retrying.')}
 if(!fs.existsSync(dir))throw Error('Create /papers in the application directory and add PDFs.');
 const files=pdfs(dir);if(!files.length)throw Error('No PDFs found in /papers.');
 const metaPath=path.join(dir,'metadata.json');const metadata=fs.existsSync(metaPath)?JSON.parse(fs.readFileSync(metaPath,'utf8')):{};
 let state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,'utf8')):{stores:{}};
 let id=process.env.OPENAI_VECTOR_STORE_ID||state.lastVectorStoreId;
 if(id)await api(`/vector_stores/${encodeURIComponent(id)}`);
 else{const store=await api('/vector_stores',{name:'OCD Compass Research Library'});id=store.id;state.lastVectorStoreId=id;writeState(state)}
 console.log(`OPENAI_VECTOR_STORE_ID=${id}`);state.lastVectorStoreId=id;state.stores[id]??={};writeState(state);
 const attached=[];let after='';do{const page=await api(`/vector_stores/${id}/files?limit=100${after?'&after='+encodeURIComponent(after):''}`);attached.push(...page.data);after=page.has_more?page.last_id:''}while(after);
 const failures=[];
 for(const file of files){const filename=path.relative(dir,file).replaceAll('\\','/');try{
 const bytes=fs.readFileSync(file);if(bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Not a valid PDF header');
 const sha=crypto.createHash('sha256').update(bytes).digest('hex');const meta=metadata[filename]||{};
 const attrs={filename:filename.slice(0,256),title:String(meta.title||path.basename(file,'.pdf')).slice(0,256),year:String(meta.year||'unknown'),topic:String(meta.topic||'unclassified').slice(0,256),evidence_type:String(meta.evidence_type||'unspecified').slice(0,256),retrieval_group:meta.retrieval_group==='safety'?'safety':meta.retrieval_group==='general'?'general':'unreviewed',sha256:sha,source_url:String(meta.source_url||'').slice(0,256)};
 let saved=state.stores[id][sha];let remote=attached.find(f=>f.attributes?.sha256===sha);
 if(remote){saved={fileId:remote.id};state.stores[id][sha]=saved;writeState(state)}
 if(!saved){const form=new FormData();form.append('purpose','assistants');form.append('file',new Blob([bytes],{type:'application/pdf'}),path.basename(file));const upload=await api('/files',form);saved={fileId:upload.id};state.stores[id][sha]=saved;writeState(state)}
 if(!remote){remote=await api(`/vector_stores/${id}/files`,{file_id:saved.fileId,attributes:attrs});attached.push(remote)}
 else await api(`/vector_stores/${id}/files/${saved.fileId}`,{attributes:attrs});
 const deadline=Date.now()+600000;
 while(remote.status==='in_progress'){if(Date.now()>deadline)throw Error('Processing timed out; rerun to resume without reuploading.');await new Promise(r=>setTimeout(r,1500));remote=await api(`/vector_stores/${id}/files/${saved.fileId}`)}
 if(remote.status!=='completed')throw Error(`Processing ${remote.status}: ${remote.last_error?.code||'unknown error'}. Remove/reprocess this file in the store before retrying.`);
 saved.status='completed';saved.filename=filename;writeState(state);console.log(`Ready: ${filename}${attrs.retrieval_group==='unreviewed'?' (excluded from search until metadata is reviewed)':''}`);
 }catch(e){failures.push(filename);console.error(`Failed: ${filename}: ${e.message}`)}}
 console.log(`\nPut this in .env:\nOPENAI_VECTOR_STORE_ID=${id}\nStartup reuses this store; it never uploads papers.`);
 if(failures.length)throw Error(`${failures.length} paper(s) failed. Successful uploads are saved; fix errors and rerun.`);
 console.log(`Completed: ${files.length} PDFs processed.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>{if(locked)fs.unlinkSync(lock)});
