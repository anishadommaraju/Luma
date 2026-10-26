import {useEffect,useRef,useState} from 'react';
import MarkdownAnswer from './MarkdownAnswer';
import SourceCard from './SourceCard';
import type {Source} from './SourceCard';
import type {Audience} from './audience';
import {audienceProfiles} from './audience';
type Citation={file_id:string;index:number;number:number};
type Answer={segments:{text:string;citations:Citation[]}[];sources:Source[];retrieved:Source[];notice?:string;insufficient:boolean;outOfScope?:boolean};
type Turn={question:string;answer?:Answer;error?:string};
export default function ResearchChat({initialQuestion='',audience}:{initialQuestion?:string;audience:Audience}){
 const profile=audienceProfiles[audience];const starters=[...profile.starters];
 const privacyMessage=audience==='kid'
  ?'When you press “Search papers & answer,” your question and matching parts of the research papers are sent to OpenAI. Do not type your name, school, address, birthday, photo, phone number, or email. Your chat disappears when this page refreshes.'
  :'When you press “Search papers & answer,” your question, recent questions, and matching research excerpts are sent to OpenAI. Do not include names, schools, addresses, birthdays, photographs, contact information, or other identifying details. Chat history stays in this page’s memory and is cleared on refresh.';
 const [question,setQuestion]=useState(''),[turns,setTurns]=useState<Turn[]>([]),[loading,setLoading]=useState(false),[configured,setConfigured]=useState<boolean|null>(null);
 useEffect(()=>{if(initialQuestion)setQuestion(initialQuestion)},[initialQuestion]);
 const controller=useRef<AbortController|null>(null);const latest=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{fetch('/api/health').then(r=>r.json()).then(r=>setConfigured(r.configured)).catch(()=>setConfigured(false));return()=>controller.current?.abort()},[]);
 useEffect(()=>{if(turns.length)latest.current?.scrollIntoView({block:'nearest',behavior:'smooth'})},[turns,loading]);
 async function ask(value=question){const q=value.trim();if(!q||loading)return;setQuestion('');setLoading(true);const history=turns.slice(-3).map(t=>t.question);setTurns(t=>[...t,{question:q}]);controller.current=new AbortController();
 try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history,audience}),signal:controller.current.signal});const data=await res.json();if(!res.ok)throw Error(data.error||'Unable to answer.');setTurns(t=>t.map((x,i)=>i===t.length-1?{...x,answer:data}:x))}
 catch(e){setTurns(t=>t.map((x,i)=>i===t.length-1?{...x,error:e instanceof Error&&e.name==='AbortError'?'Request cancelled.':e instanceof Error?e.message:'Could not connect to the research server.'}:x))}
 finally{setLoading(false)}
 }
 return <section className={`chat-section section audience-${audience}`} id="chat"><div className="section-top"><div><div className="eyebrow dark">YOUR RESEARCH LIBRARY, IN CONVERSATION</div><h2>{profile.chatHeading}</h2></div><span className="chat-badge">Research • Education • Sources</span></div><p className="chat-description">{profile.chatDescription}</p>
 {configured===false&&<p role="status" className="chat-notice">The research service needs configuration. Questions will show a specific setup error until the API and library are connected.</p>}
 <div className="suggestions">{starters.map(q=><button disabled={loading} onClick={()=>ask(q)} key={q}>{q}</button>)}</div>
 <div className="conversation" aria-live="polite" aria-busy={loading}>{turns.map((turn,i)=><article className="chat-turn" key={i}><h3>{turn.question}</h3>{turn.error&&<div role="alert" className="chat-error">{turn.error}<button onClick={()=>ask(turn.question)} disabled={loading}>Try again</button></div>}{turn.answer&&<><div className="answer-label">{turn.answer.outOfScope?'LUMA':'AI-GENERATED EXPLANATION'}</div>{turn.answer.notice&&<p className="chat-notice">{turn.answer.notice}</p>}<div className="answer-text">{turn.answer.segments.map((s,j)=><MarkdownAnswer key={j} {...s} prefix={`turn-${i}`}/>)}</div>{turn.answer.sources.length>0&&<div className="answer-sources"><h4>Sources</h4>{turn.answer.sources.map((source,j)=><SourceCard source={source} number={j+1} id={`turn-${i}-${j+1}`} key={source.fileId}/>)}</div>}{turn.answer.retrieved.length>0&&<details className="retrieval-details"><summary>Other search evidence · all retrieved sources ({turn.answer.retrieved.length})</summary>{turn.answer.retrieved.map(s=><div key={s.fileId}><strong>{s.title}</strong>{s.excerpts.map((t,k)=><blockquote key={k}>{t}</blockquote>)}</div>)}</details>}</>}</article>)}{loading&&<p role="status">Searching the research library and checking sources…</p>}<div ref={latest}/></div>
 <form onSubmit={e=>{e.preventDefault();ask()}}><label htmlFor="research-question">Your question</label><textarea id="research-question" aria-describedby="chat-privacy-note" autoComplete="off" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={2000} rows={3} placeholder={profile.placeholder} required/><div className="chat-actions"><span>{question.length}/2,000</span>{loading?<button type="button" onClick={()=>controller.current?.abort()}>Cancel</button>:<button type="submit" className="button coral" disabled={!question.trim()}>Search papers & answer ↗</button>}<button type="button" disabled={loading||!turns.length} onClick={()=>setTurns([])}>Clear chat</button></div></form>
 <p className="chat-privacy" id="chat-privacy-note"><strong>{audience==='kid'?'Before you send a question:':'Privacy:'}</strong> {privacyMessage} AI answers can contain errors, so check the cited passages.</p></section>
}
