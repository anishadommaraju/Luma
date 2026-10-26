import http from 'node:http';
import {api} from './openai.mjs';
import {requestBody,parseResponse,safetyCheck} from './rag.mjs';
const send=(res,code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
let busy=0;let requests=[];
http.createServer(async(req,res)=>{try{
 if(!/^(127\.0\.0\.1|localhost):\d+$/.test(req.headers.host||''))return send(res,403,{error:'Local access only.'});
 if(req.headers.origin&&!/^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|4173|8787)$/.test(req.headers.origin))return send(res,403,{error:'Origin not allowed.'});
 if(req.method==='GET'&&req.url==='/api/health')return send(res,200,{configured:!!process.env.OPENAI_API_KEY&&!!process.env.OPENAI_VECTOR_STORE_ID,model:process.env.OPENAI_MODEL||'gpt-5.6-luna'});
 if(req.method!=='POST'||req.url!=='/api/chat')return send(res,404,{error:'Not found'});
 if(!req.headers['content-type']?.startsWith('application/json'))return send(res,415,{error:'JSON required'});
 requests=requests.filter(t=>Date.now()-t<60000);if(requests.length>=12||busy>=2)return send(res,429,{error:'Please wait a moment before another question.'});requests.push(Date.now());
 let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>16000)return send(res,413,{error:'Message too long.'})}
 let data;try{data=JSON.parse(raw)}catch{return send(res,400,{error:'Invalid JSON.'})}
 const q=data.question;if(typeof q!=='string'||!q.trim()||q.length>2000)return send(res,400,{error:'Enter a question of up to 2,000 characters.'});
 const history=Array.isArray(data.history)?data.history.filter(x=>typeof x==='string').slice(-3).map(x=>x.slice(0,2000)):[];
 const audience=['kid','teen','caregiver'].includes(data.audience)?data.audience:'caregiver';
 const safety=safetyCheck(q);const notice=safety.relevant?'Safety guidance, separate from research: If you or someone else is in immediate danger, or you may act on thoughts of harm, contact local emergency services now and reach out to someone you trust. Move away from weapons or other means of harm if you can do so safely. This assistant cannot assess immediate risk.':null;
 if(safety.immediate)return send(res,200,{segments:[],sources:[],retrieved:[],notice,insufficient:true});
 if(!process.env.OPENAI_VECTOR_STORE_ID)return send(res,503,{error:'Research library is not connected yet. Run ingestion and set OPENAI_VECTOR_STORE_ID in .env.'});
 busy++;try{const result=await api('/responses',requestBody(q,history,process.env.OPENAI_VECTOR_STORE_ID,process.env.OPENAI_MODEL||'gpt-5.6-luna',audience));return send(res,200,{...parseResponse(result),notice})}finally{busy--}
 }catch(e){if(!res.headersSent)send(res,502,{error:e.name==='TimeoutError'?'The research service timed out. Please try again.':e.message?.startsWith('OpenAI')||/citation|retriev|incomplete|research/i.test(e.message)?e.message:'Unable to answer right now. Please check server configuration and try again.'})}
}).listen(8787,'127.0.0.1',()=>console.log('OCD research API: http://127.0.0.1:8787'));
