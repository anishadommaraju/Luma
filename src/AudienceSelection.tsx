import {ArrowRight, HeartHandshake, MessageCircle, Smile, Sparkles} from 'lucide-react';
import {useEffect} from 'react';
import type {Audience} from './audience';

const choices: {id: Audience; title: string; icon: typeof Smile}[] = [
  {id:'kid',title:"I'm a kid (6–12)",icon:Smile},
  {id:'teen',title:"I'm a teen (13–19)",icon:MessageCircle},
  {id:'caregiver',title:"I'm an adult or caregiver",icon:HeartHandshake},
];

export default function AudienceSelection({onSelect}:{onSelect:(audience:Audience)=>void}){
  useEffect(()=>{window.scrollTo(0,0)},[]);
  return <main className="audience-page">
    <div className="audience-brand"><Sparkles/><span>luma.</span></div>
    <section className="audience-panel" aria-labelledby="audience-title">
      <div className="eyebrow dark">UNDERSTAND OCD. FEEL LESS ALONE.</div>
      <h1 id="audience-title">Who is using Luma today?</h1>
      <div className="audience-choices">
        {choices.map(({id,title,icon:Icon})=><button key={id} className={`audience-choice ${id}`} onClick={()=>onSelect(id)}>
          <span className="audience-icon"><Icon aria-hidden="true"/></span>
          <span className="audience-copy"><strong>{title}</strong></span>
          <ArrowRight className="audience-arrow" aria-hidden="true"/>
        </button>)}
      </div>
      <p className="audience-limit"><strong>Luma is educational.</strong> It cannot diagnose OCD, replace a healthcare professional, or provide emergency help.</p>
    </section>
  </main>
}
