import {json,openAI,parseResponse,requestBody,safetyCheck} from './_shared.js';

const requests=new Map();
const encoder=new TextEncoder();

export async function onRequestPost({request,env}){
  try{
    const origin=request.headers.get('Origin');
    if(origin&&origin!==new URL(request.url).origin)return json({error:'Origin not allowed.'},403);
    if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
    const now=Date.now();const client=request.headers.get('CF-Connecting-IP')||'unknown';
    const recent=(requests.get(client)||[]).filter(time=>now-time<60000);
    if(recent.length>=12)return json({error:'Please wait a moment before another question.'},429);
    recent.push(now);requests.set(client,recent);
    const raw=await request.text();
    if(encoder.encode(raw).byteLength>16000)return json({error:'Message too long.'},413);
    let data;try{data=JSON.parse(raw)}catch{return json({error:'Invalid JSON.'},400)}
    const question=data.question;
    if(typeof question!=='string'||!question.trim()||question.length>2000)return json({error:'Enter a question of up to 2,000 characters.'},400);
    const history=Array.isArray(data.history)?data.history.filter(item=>typeof item==='string').slice(-3).map(item=>item.slice(0,2000)):[];
    const safety=safetyCheck(question);
    const notice=safety.relevant?'Safety guidance, separate from research: If you or someone else is in immediate danger, or you may act on thoughts of harm, contact local emergency services now and reach out to someone you trust. Move away from weapons or other means of harm if you can do so safely. This assistant cannot assess immediate risk.':null;
    if(safety.immediate)return json({segments:[],sources:[],retrieved:[],notice,insufficient:true});
    if(!env.OPENAI_API_KEY||!env.OPENAI_VECTOR_STORE_ID)return json({error:'Research library is not connected. Configure the required Cloudflare variables and secrets.'},503);
    const result=await openAI(env,requestBody(question,history,env.OPENAI_VECTOR_STORE_ID,env.OPENAI_MODEL||'gpt-5.6-luna'));
    return json({...parseResponse(result),notice});
  }catch(error){
    const message=error instanceof Error?error.message:'Unable to answer right now.';
    return json({error:message.startsWith('OpenAI')||/citation|retriev|incomplete|research/i.test(message)?message:'Unable to answer right now. Please check the Cloudflare Function configuration and try again.'},502);
  }
}

export function onRequestGet(){return json({error:'Method not allowed.'},405)}
