import metadataByFilename from './citation-metadata.generated.js';
import {SYSTEM_INSTRUCTIONS} from '../server/instructions.mjs';

export const OUT_OF_SCOPE_MESSAGE='Im sorry i cant answer questions unrelated to OCD';

export function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}

export function safetyCheck(question){
  const relevant=/suicid|self[ -]?harm|kill myself|end my life|hopeless|severe depression|crisis|hurt myself|want to die|not want to live/i.test(question);
  const immediate=/(i (?:am going to|plan to|will|want to) (?:kill|hurt|harm) myself|i (?:want to die|can't stay safe|cannot stay safe)|end my life)/i.test(question);
  const otherDanger=/(i (?:am going to|plan to|will|intend to) (?:kill|hurt|harm|attack) (?:someone|him|her|them|another person)|overdos(?:ed|ing)|immediate danger|medical emergency|can.t stay safe)/i.test(question);
  return {relevant:relevant||otherDanger,immediate:immediate||otherDanger};
}

export function requestBody(question,history,store,model,audience='caregiver'){
  const safety=safetyCheck(question);
  return {model,store:false,instructions:SYSTEM_INSTRUCTIONS,input:JSON.stringify({question,previousQuestions:history,audience}),tools:[{type:'file_search',vector_store_ids:[store],max_num_results:10,filters:safety.relevant?{type:'in',key:'retrieval_group',value:['general','safety']}:{type:'eq',key:'retrieval_group',value:'general'}}],tool_choice:'required',include:['file_search_call.results'],max_output_tokens:2200};
}

function sourceDetails(id,hits,annotations){
  const first=hits[0]||{};const attrs=first.attributes||{};
  const clean=value=>typeof value==='string'&&value.trim()?value.trim():null;
  const filename=clean(first.filename)||clean(annotations.find(annotation=>annotation.file_id===id)?.filename)||clean(attrs.filename)||'Filename unavailable';
  const metadata=metadataByFilename[filename]||{};
  const title=clean(metadata.title)||clean(attrs.title)||filename;
  const yearValue=clean(metadata.year)||clean(attrs.year);const year=/^\d{4}$/.test(yearValue||'')?yearValue:null;
  const authors=Array.isArray(metadata.authors)?metadata.authors.filter(author=>typeof author==='string'&&author.trim()):[];
  const authorLabel=clean(metadata.citation_author)||(authors.length?authors[0]+(authors.length>1?' et al.':''):null);
  const label=authorLabel&&year?`${authorLabel} (${year}) — ${title}`:title;
  const url=clean(metadata.source_url)||clean(attrs.source_url);
  return {fileId:id,filename,title,year,authors,label,url:/^https:\/\/(pmc\.ncbi\.nlm\.nih\.gov|doi\.org)\//.test(url||'')?url:null,excerpts:[...new Set(hits.map(hit=>hit.text).filter(Boolean))]};
}

function outOfScopeAnswer(){return {segments:[{text:OUT_OF_SCOPE_MESSAGE,citations:[]}],sources:[],retrieved:[],insufficient:false,outOfScope:true};}

export function parseResponse(result){
  if(result.status!=='completed')throw Error('The answer was incomplete. Please try again.');
  const calls=(result.output||[]).filter(item=>item.type==='file_search_call');
  if(!calls.length||calls.some(call=>call.status!=='completed'))throw Error('Research retrieval did not complete. No ungrounded answer was returned.');
  const retrieved=calls.flatMap(call=>call.results||[]).filter(hit=>hit.text&&hit.file_id);
  const outputs=(result.output||[]).filter(item=>item.type==='message').flatMap(item=>item.content||[]);
  if(outputs.some(item=>item.type==='refusal'))return {segments:[{text:'I cannot help with that request. You can ask a general educational question about OCD research.',citations:[]}],sources:[],retrieved:[],insufficient:true};
  const segments=outputs.filter(item=>item.type==='output_text').map(item=>({text:item.text,citations:(item.annotations||[]).filter(annotation=>annotation.type==='file_citation')}));
  if(segments.some(segment=>segment.text.trim()===OUT_OF_SCOPE_MESSAGE))return outOfScopeAnswer();
  const citations=segments.flatMap(segment=>segment.citations);
  const insufficient=segments.some(segment=>segment.text.includes("I couldn't find enough information in the research library to answer that confidently."));
  if(!retrieved.length)return {segments:[{text:"I couldn't find enough information in the research library to answer that confidently. No usable supporting passages were retrieved.",citations:[]}],sources:[],retrieved:[],insufficient:true};
  if(!insufficient&&!citations.length)throw Error('The response contained no research citations. Please try again.');
  if(citations.some(citation=>!retrieved.some(hit=>hit.file_id===citation.file_id)))throw Error('A citation could not be matched to retrieved evidence. Please try again.');
  const ids=[...new Set(citations.map(citation=>citation.file_id))];
  const source=id=>sourceDetails(id,retrieved.filter(hit=>hit.file_id===id),citations);
  return {segments:segments.map(segment=>({...segment,citations:segment.citations.map(citation=>({...citation,number:ids.indexOf(citation.file_id)+1}))})),sources:ids.map(source),retrieved:[...new Set(retrieved.map(hit=>hit.file_id))].map(source),insufficient};
}

export async function openAI(env,body){
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!response.ok){let info;try{info=await response.json()}catch{}const code=info?.error?.code||'api_error';throw Error(`OpenAI HTTP ${response.status} (${code}). ${response.status===401?'Replace the API key in Cloudflare.':code==='model_not_found'?'The configured OPENAI_MODEL is unavailable for this API account.':response.status===429?'Check API quota/billing, or retry later.':'Check the model, vector store, file access, and API configuration.'}`)}
  return response.json();
}
