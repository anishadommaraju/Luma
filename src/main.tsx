import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, BookOpen, ShieldCheck, Menu, X, Compass, Sparkles, HeartHandshake, School } from 'lucide-react';
import './style.css';
import ResearchChat from './ResearchChat';
import SymptomCheck from './screening/SymptomCheck';
import About from './About';
import AudienceSelection from './AudienceSelection';
import {audienceProfiles} from './audience';
import type {Audience} from './audience';
import AudienceLanding from './AudienceLanding';
import FamilyAccommodation from './FamilyAccommodation';
import PediatricDifferences from './PediatricDifferences';

const sources = {
  nimh: 'https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd',
  screener: 'https://iocdf.org/screener/',
  nice: 'https://www.nice.org.uk/guidance/cg31/chapter/Recommendations',
};
const topics = [
  {name:'Understanding OCD', label:'HEALTH INFORMATION · NIMH', title:'Look at the pattern and its impact.', text:'OCD can involve recurring obsessions, compulsions, or both. Symptoms may take up substantial time, cause distress, or interfere with daily activities. A professional assessment considers the full picture.', note:'A description of symptoms cannot establish an individual diagnosis.', url:sources.nimh, link:'Read the NIMH overview'},
  {name:'Screening & assessment', label:'SCREENING RESOURCE · IOCDF', title:'A starting point for a conversation.', text:'The International OCD Foundation provides the OCI-4 for adults and the OCI-CV-5 for young people. These brief screening measures can help identify a need for further assessment.', note:'A screening result does not confirm or rule out OCD. Discuss your concerns and results with a licensed mental health professional.', url:sources.screener, link:'Read about the screening tools'},
  {name:'Treatment evidence', label:'CLINICAL GUIDELINE · NICE CG31', title:'Understand established care options.', text:'NICE recommendations include cognitive behavioural therapy (CBT) with exposure and response prevention (ERP), and selective serotonin reuptake inhibitors (SSRIs). Recommendations depend on age, impairment, preferences, and response to prior care.', note:'This UK guideline informs care; it is not a personal treatment plan. Discuss appropriate options with a qualified clinician.', url:sources.nice, link:'Read the treatment recommendations'},
];
function External({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}){return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={18}/><span className="sr-only"> (opens in a new tab)</span></a>}
function App(){
 const [menu,setMenu]=useState(false); const [topic,setTopic]=useState(0);
 const [route,setRoute]=useState(window.location.pathname);
 const [researchPrompt,setResearchPrompt]=useState('');
 const [audience,setAudience]=useState<Audience|null>(()=>{try{const saved=localStorage.getItem('ocd-compass-audience');return saved==='kid'||saved==='teen'||saved==='caregiver'?saved:null}catch{return null}});
 useEffect(()=>{const update=()=>setRoute(window.location.pathname);window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update)},[]);
 const navigate=(path:string)=>{window.history.pushState({},'',path);setRoute(window.location.pathname);window.scrollTo(0,0)};
 const chooseAudience=(value:Audience)=>{try{localStorage.setItem('ocd-compass-audience',value)}catch{}window.history.pushState({},'',`/${value}`);setRoute(`/${value}`);setAudience(value);window.scrollTo(0,0)};
 const chooseChildCheck=(value:'kid'|'teen')=>{try{localStorage.setItem('ocd-compass-audience',value)}catch{}setAudience(value);navigate('/check')};
 const changeAudience=()=>{try{localStorage.removeItem('ocd-compass-audience')}catch{}window.history.pushState({},'','/');setRoute('/');setAudience(null);setMenu(false);window.scrollTo(0,0)};
 if(!audience)return <AudienceSelection onSelect={chooseAudience}/>;
 const profile=audienceProfiles[audience];
 const active=topics[topic];
 const askFromLanding=(question:string)=>{setResearchPrompt(question);requestAnimationFrame(()=>document.getElementById('chat')?.scrollIntoView({behavior:'smooth'}))};
 if(route==='/about')return <><button className="floating-audience-switch" onClick={changeAudience}>{profile.shortLabel} · Change audience</button><About onExplore={question=>{setResearchPrompt(question);navigate('/#chat')}}/></>;
 if(route==='/check'||route==='/check/results')return <><button className="floating-audience-switch" onClick={changeAudience}>{profile.shortLabel} · Change audience</button><SymptomCheck key={audience} audience={audience} onAudienceChange={chooseChildCheck} path={route} navigate={navigate} onExplore={question=>{setResearchPrompt(question);navigate('/#chat')}}/></>;
 const navItems=audience==='kid'?[['#home','Home'],['#chat','Ask'],['#kid-help','Get help']]:audience==='teen'?[['#home','Home'],['#chat','Ask research'],['/check','Symptom check'],['#research','Evidence']]:[['#home','Home'],['#family-accommodation','Family support'],['#chat','Ask research'],['/check','Symptom check'],['#research','Research guide']];
 return <div className={`app-experience experience-${audience}`}>
 <header><a className="brand" href="#home" aria-label="Luma home"><Sparkles/><span>luma<span className="brand-dot">.</span></span></a><nav className={menu?'open':''} aria-label="Main navigation">{navItems.map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}<button className="audience-switch mobile-audience-switch" onClick={changeAudience}>Switch: {profile.shortLabel}</button></nav><div className="header-actions"><button className="audience-switch" onClick={changeAudience}>{profile.shortLabel} · Change</button><a className="nav-link" href="/about">About <ArrowUpRight size={17}/></a></div><button className="menu-button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button></header>
 <main>
 <AudienceLanding audience={audience} onAsk={askFromLanding}/>
 {audience!=='kid'&&<section className="intro-strip" aria-label="How this guide works"><div><BookOpen/><p><strong>Sources you can inspect</strong><span>Read the evidence behind each summary</span></p></div><div><ShieldCheck/><p><strong>Clear about its limits</strong><span>Screening is not a clinical diagnosis</span></p></div><div><Compass/><p><strong>A practical next step</strong><span>Prepare for professional support</span></p></div></section>}
 {audience==='caregiver'&&<FamilyAccommodation onAsk={askFromLanding}/>} 
 <PediatricDifferences audience={audience} onAsk={askFromLanding}/>
 <ResearchChat initialQuestion={researchPrompt} audience={audience}/>
 {audience==='kid'&&<section className="kid-help-section" id="kid-help"><div className="kid-help-icon"><HeartHandshake/></div><div><span>WHEN WORRIES FEEL TOO BIG</span><h2>Tell a grown-up you trust.</h2><p>You can say, “I keep getting stuck on worries and I want some help.”</p></div><a href="#chat">Ask what to say <ArrowRight/></a></section>}
 {audience!=='kid'&&<>
 <section className="depth section" id="research"><div className="depth-heading"><div className="eyebrow">RESEARCH GUIDE</div><h2>Start with a question.<br/>Follow the evidence.</h2><p>Choose a topic for a plain-language summary and its source. These are curated explanations, not live AI-generated answers.</p><div className="zone-tabs" role="tablist" aria-label="OCD research topics" aria-orientation="vertical">{topics.map((t,i)=><button key={t.name} id={`tab-${i}`} role="tab" tabIndex={topic===i?0:-1} aria-controls="topic-panel" aria-selected={topic===i} onClick={()=>setTopic(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowDown')next=(i+1)%3;else if(e.key==='ArrowUp')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();setTopic(next);document.getElementById(`tab-${next}`)?.focus()}}><span>0{i+1}</span>{t.name}<ArrowRight size={18}/></button>)}</div></div><div className="evidence-panel" role="tabpanel" tabIndex={0} id="topic-panel" aria-labelledby={`tab-${topic}`}><div className="eyebrow">{active.label}</div><h3>{active.title}</h3><p>{active.text}</p><aside>{active.note}</aside><External href={active.url}>{active.link}</External></div></section>
 <section className="section" id="next-steps"><div className="section-top"><div><div className="eyebrow dark">{audience==='teen'?'WHAT YOU CAN DO NEXT':'AFTER SCREENING'}</div><h2>{audience==='teen'?'You deserve useful support.':'Make room for a fuller conversation.'}</h2></div><p>{audience==='teen'?'You do not need perfect words to ask for help.':<>You can seek support even if you are<br/>unsure how to describe your experience.</>}</p></div><div className="cards"><article className="guide-card">{audience==='teen'?<School/>:<span className="step">01</span>}<h3>{audience==='teen'?'Notice the impact':'Bring your questions'}</h3><p>{audience==='teen'?'Think about whether worries or rituals affect school, sleep, friends, family, or things you want to do.':'Consider what you want help with and how your concerns affect everyday life. If you took a screener, you can share its results at your appointment.'}</p></article><article className="guide-card">{audience==='teen'?<HeartHandshake/>:<span className="step">02</span>}<h3>{audience==='teen'?'Tell someone you trust':'Ask about assessment'}</h3><p>{audience==='teen'?'A parent, caregiver, school counselor, doctor, or another trusted adult can help you find qualified support.':'A licensed mental health professional can consider symptoms, history, and other possible explanations. A score is only one part of that conversation.'}</p></article><article className="guide-card"><span className="step">03</span><h3>Ask about OCD experience</h3><p>Ask whether the professional has experience assessing and treating OCD in children or teenagers, including CBT with ERP.</p><External href={sources.nice}>Treatment guidance · NICE</External></article></div></section>
 <section className="notes section" id="sources"><div><div className="eyebrow dark">TRANSPARENT BY DESIGN</div><h2>Read beyond the summary.</h2><p>Start with health information, then examine the screening resource or clinical guideline. Sources serve different purposes and do not replace individual care.</p><p className="review-date">Content checked: September 28, 2026.<br/>A source check is not a clinical review.</p></div><div className="resource-links"><External href={sources.nimh}><span>01</span>NIMH · OCD overview</External><External href={sources.screener}><span>02</span>IOCDF · Screening tools</External><External href={sources.nice}><span>03</span>NICE CG31 · Treatment guidance</External></div></section>
 </>}
 </main><footer><a className="brand" href="#home"><Sparkles/><span>luma.</span></a><p>Understand OCD. Feel less alone.</p><span>EDUCATIONAL RESOURCE</span></footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
