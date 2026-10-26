import {useState} from 'react';
import {ArrowRight, BookOpen, ChevronDown, CircleHelp, ClipboardList, Cloud, HeartHandshake, MessageCircle, RefreshCcw, Repeat2, ShieldCheck, Sparkles, Sun} from 'lucide-react';
import type {Audience} from './audience';

type Props={audience:Audience;onAsk:(question:string)=>void};

export default function AudienceLanding({audience,onAsk}:Props){
 if(audience==='kid')return <section className="kid-home" id="home">
   <CrayonStar className="kid-star-left" fill="#ffe58d" stroke="#8b68d6"/>
   <CrayonStar className="kid-star-right" fill="#bdebf1" stroke="#ed79a3"/>
   <div className="kid-hero">
     <div className="kid-mascot" aria-hidden="true"><Sparkles/><span>you’re not alone</span></div>
     <p className="kid-kicker">A friendly place to learn about OCD</p>
     <h1>Big worries can get <em>stuck.</em></h1>
     <p>We can help you understand why—and what can help.</p>
   </div>
   <div className="kid-actions" aria-label="Choose what to do">
     <button className="kid-action ask" onClick={()=>onAsk('What is OCD, and why can worries feel stuck?')}><MessageCircle/><strong>Ask a question</strong><span>Get a simple answer</span><ArrowRight/></button>
     <a className="kid-action check" href="/check"><ClipboardList/><strong>Symptom check</strong><span>Answer 17 simple questions</span><ArrowRight/></a>
     <a className="kid-action help" href="#kid-help"><HeartHandshake/><strong>Get help</strong><span>Talk to a grown-up</span><ArrowRight/></a>
   </div>
   <p className="kid-limit"><ShieldCheck/> This website teaches. It cannot tell you if you have OCD.</p>
   <KidOcdCycle onAsk={onAsk}/>
 </section>;

 if(audience==='teen')return <section className="teen-home" id="home">
   <div className="teen-stars" aria-hidden="true">{Array.from({length:18},(_,i)=><span key={i}/>)}</div>
   <div className="teen-crayon-cluster" aria-hidden="true"><TeenCrayonStar className="teen-crayon-one"/><TeenCrayonStar className="teen-crayon-two"/><TeenCrayonStar className="teen-crayon-three"/></div>
   <div className="teen-copy"><span className="teen-label">LUMA / FOR TEENS</span><h1>Real answers.<br/><em>No judgment.</em></h1><p>Understand intrusive thoughts, rituals, doubt, and treatment using evidence you can actually inspect.</p><div className="teen-buttons"><button onClick={()=>onAsk('How can OCD affect a teenager’s thoughts, school, and daily life?')}>Ask the research <ArrowRight/></button><a href="/check">Try a symptom check</a></div><small>Educational information—not a diagnosis or personal treatment plan.</small></div>
   <aside className="teen-explore"><div className="teen-orbit" aria-hidden="true"><span/><span/><span/></div><p>EXPLORE WITHOUT THE HYPE</p><h2>Questions that can be hard to ask out loud.</h2><ul><li>Intrusive thoughts</li><li>Checking and doubt</li><li>School and friendships</li><li>What ERP actually involves</li></ul></aside>
 </section>;

 return <section className="caregiver-home section" id="home">
   <div><div className="eyebrow dark">EVIDENCE-GROUNDED GUIDANCE FOR FAMILIES</div><h1>Understand the pattern.<br/><em>Support the child.</em></h1><p>Explore pediatric OCD research, recognize possible impacts at home and school, and prepare informed questions for a qualified professional.</p><p className="scope">Educational guidance with visible sources. Luma does not diagnose or provide a personal treatment plan.</p><div className="caregiver-buttons"><button onClick={()=>onAsk('How does OCD present in children and teenagers?')}>Ask the research <ArrowRight/></button><a href="/check">Explore the symptom check</a></div></div>
   <aside><BookOpen/><span>PEDIATRIC RESEARCH LIBRARY</span><h2>Evidence you can inspect</h2><p>Answers search the curated papers first and show the sources and retrieved excerpts.</p><div><strong>Assessment</strong><strong>Family support</strong><strong>Treatment</strong><strong>Daily life</strong></div></aside>
 </section>;
}

const kidCycleSteps=[
 {title:'An unwanted thought or feeling',short:'Something upsetting or “not right” pops into your mind.',explanation:'A thought, picture, urge, or “not right” feeling can pop in even when you do not want it. Having a thought does not mean you want it to happen.',question:'What does research say about unwanted intrusive thoughts and not-right feelings in OCD?',icon:Cloud},
 {title:'Distress or doubt',short:'The thought brings worry or makes you feel unsure.',explanation:'Your brain may start asking “What if?” or feel like it must be completely sure. That can bring fear, guilt, discomfort, or doubt.',question:'What does research say about distress, doubt, and the need for certainty in OCD?',icon:CircleHelp},
 {title:'A ritual or avoidance',short:'You feel pushed to check, repeat, avoid, or ask for reassurance.',explanation:'You may feel pushed to do something again, check, stay away, repeat words in your mind, or ask someone to make sure. These actions are sometimes called compulsions or rituals.',question:'What does research say about rituals, checking, avoidance, and reassurance seeking in OCD?',icon:Repeat2},
 {title:'Temporary relief',short:'The worry feels smaller—but only for a little while.',explanation:'The action may make the worry feel smaller for a short time. That relief can teach the brain to ask for the same ritual again when the worry returns.',question:'Why can compulsions bring temporary relief while keeping the OCD cycle going?',icon:Sun},
 {title:'The concern returns',short:'The same worry comes back and the loop may begin again.',explanation:'Because the relief does not last, the concern can return. The brain may then ask for more checking, avoiding, reassurance, or another ritual.',question:'What does research say about why OCD concerns and compulsions can become repetitive?',icon:RefreshCcw},
] as const;

function KidOcdCycle({onAsk}:{onAsk:(question:string)=>void}){
 const [open,setOpen]=useState<number|null>(null);
 return <section className="kid-cycle" aria-labelledby="kid-cycle-title">
  <div className="kid-cycle-heading"><span>THE OCD LOOP</span><h2 id="kid-cycle-title">How a worry can get stuck</h2><p>This is one way OCD can work. Everyone’s experience can be different.</p></div>
  <ol>{kidCycleSteps.map((step,index)=>{const Icon=step.icon;const expanded=open===index;return <li key={step.title} className={`kid-cycle-step cycle-step-${index+1}`}>
   <button className="kid-cycle-button" aria-expanded={expanded} aria-controls={`kid-cycle-detail-${index}`} onClick={()=>setOpen(expanded?null:index)}><span className="kid-cycle-icon"><Icon aria-hidden="true"/></span><span><strong>{step.title}</strong><small>{step.short}</small></span><ChevronDown className={expanded?'open':''} aria-hidden="true"/></button>
   {expanded&&<div className="kid-cycle-detail" id={`kid-cycle-detail-${index}`}><p>{step.explanation}</p><button onClick={()=>onAsk(step.question)}>Ask Luma about this step <ArrowRight/></button></div>}
  </li>})}</ol>
  <p className="kid-cycle-note"><Sparkles/> Clicking “Ask Luma” searches the research papers and shows the sources used.</p>
 </section>
}

function CrayonStar({className,fill,stroke}:{className:string;fill:string;stroke:string}){
 return <svg className={`kid-doodle-star ${className}`} viewBox="0 0 160 160" aria-hidden="true">
  <path className="crayon-fill" fill={fill} d="M80 10 99 56 149 59 110 90 123 139 80 111 36 139 50 90 11 59 61 56Z"/>
  <path className="crayon-line crayon-line-back" stroke={stroke} d="M80 10 99 56 149 59 110 90 123 139 80 111 36 139 50 90 11 59 61 56Z"/>
  <path className="crayon-line crayon-line-front" stroke={stroke} d="M79 13 97 58 144 61 107 89 120 134 80 108 40 134 53 89 16 61 63 58Z"/>
  <path className="crayon-scribble" stroke={stroke} d="m52 67 55-3M45 82l71-5M48 98l62-7M57 114l45-8"/>
 </svg>
}

function TeenCrayonStar({className}:{className:string}){
 return <svg className={`teen-crayon-star ${className}`} viewBox="0 0 100 100" aria-hidden="true">
  <path className="teen-star-soft" d="M50 5 61 36 95 37 68 57 78 90 50 70 22 90 32 57 5 37 39 36Z"/>
  <path className="teen-star-edge" d="M49 7 60 38 91 39 66 57 75 86 50 68 25 86 34 57 9 39 40 38Z"/>
  <path className="teen-star-cross" d="m50 7 16 50-41 29 70-47H5l70 47Z"/>
  <path className="teen-star-scratch" d="m36 31 29 4M29 45l44 2M34 59l34 1M41 72l20-2"/>
 </svg>
}
