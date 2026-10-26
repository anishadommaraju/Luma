import {localCitationMetadata,sourceDetails} from './citations.mjs';
import {SYSTEM_INSTRUCTIONS} from './instructions.mjs';
export const OUT_OF_SCOPE_MESSAGE="Im sorry i cant answer questions unrelated to OCD";
export function outOfScopeAnswer(){return {segments:[{text:OUT_OF_SCOPE_MESSAGE,citations:[]}],sources:[],retrieved:[],insufficient:false,outOfScope:true};}
export function safetyCheck(question){
 const relevant=/suicid|self[ -]?harm|kill myself|end my life|hopeless|severe depression|crisis|hurt myself|want to die|not want to live/i.test(question);
 const immediate=/(i (?:am going to|plan to|will|want to) (?:kill|hurt|harm) myself|i (?:want to die|can't stay safe|cannot stay safe)|end my life)/i.test(question);
 const otherDanger=/(i (?:am going to|plan to|will|intend to) (?:kill|hurt|harm|attack) (?:someone|him|her|them|another person)|overdos(?:ed|ing)|immediate danger|medical emergency|can.t stay safe)/i.test(question);
 return {relevant:relevant||otherDanger,immediate:immediate||otherDanger};
}
export function requestBody(question,history,store,model,audience='caregiver'){const safety=safetyCheck(question);return {model,store:false,instructions:SYSTEM_INSTRUCTIONS,input:JSON.stringify({question,previousQuestions:history,audience}),tools:[{type:'file_search',vector_store_ids:[store],max_num_results:10,filters:safety.relevant?{type:'in',key:'retrieval_group',value:['general','safety']}:{type:'eq',key:'retrieval_group',value:'general'}}],tool_choice:'required',include:['file_search_call.results'],max_output_tokens:2200};}
export function parseResponse(result){
 if(result.status!=='completed')throw Error('The answer was incomplete. Please try again.');
 const calls=(result.output||[]).filter(x=>x.type==='file_search_call');
 if(!calls.length||calls.some(c=>c.status!=='completed'))throw Error('Research retrieval did not complete. No ungrounded answer was returned.');
 const retrieved=calls.flatMap(c=>c.results||[]).filter(r=>r.text&&r.file_id);
 const outputs=(result.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]);
 if(outputs.some(x=>x.type==='refusal'))return {segments:[{text:'I cannot help with that request. You can ask a general educational question about OCD research.',citations:[]}],sources:[],retrieved:[],insufficient:true};
 const segments=outputs.filter(x=>x.type==='output_text').map(x=>({text:x.text,citations:(x.annotations||[]).filter(a=>a.type==='file_citation')}));
 if(segments.some(s=>s.text.trim()===OUT_OF_SCOPE_MESSAGE))return outOfScopeAnswer();
 const citations=segments.flatMap(x=>x.citations);const insufficient=segments.some(s=>s.text.includes("I couldn't find enough information in the research library to answer that confidently."));
 if(!retrieved.length)return {segments:[{text:"I couldn't find enough information in the research library to answer that confidently. No usable supporting passages were retrieved.",citations:[]}],sources:[],retrieved:[],insufficient:true};
 if(!insufficient&&!citations.length)throw Error('The response contained no research citations. Please try again.');
 if(citations.some(c=>!retrieved.some(r=>r.file_id===c.file_id)))throw Error('A citation could not be matched to retrieved evidence. Please try again.');
 const ids=[...new Set(citations.map(c=>c.file_id))];
 const source=(id)=>sourceDetails(id,retrieved.filter(r=>r.file_id===id),citations,localCitationMetadata(id));
 return {segments:segments.map(s=>({...s,citations:s.citations.map(c=>({...c,number:ids.indexOf(c.file_id)+1}))})),sources:ids.map(source),retrieved:[...new Set(retrieved.map(r=>r.file_id))].map(source),insufficient};
}
