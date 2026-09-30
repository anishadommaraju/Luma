import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{process.loadEnvFile(path.join(projectRoot,'.env'))}catch(e){if(e.code!=='ENOENT')throw e}
export async function api(route,body,method=body?'POST':'GET'){
 if(!process.env.OPENAI_API_KEY)throw Error('Set OPENAI_API_KEY in .env.');
 const form=body instanceof FormData;
 const response=await fetch(`https://api.openai.com/v1${route}`,{method,headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,...(!form?{'Content-Type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(120000)});
 if(!response.ok){let info;try{info=await response.json()}catch{}const code=info?.error?.code||'api_error';throw Error(`OpenAI HTTP ${response.status} (${code}). ${response.status===401?'Replace the API key in .env.':code==='model_not_found'?'The configured OPENAI_MODEL is not available for this API account. No fallback model was used.':response.status===429?'Check API quota/billing, or retry later.':'Check model, vector store, file access, and API configuration.'}`)}
 return response.json();
}
