import {ArrowRight, BookOpen, GitCompareArrows} from 'lucide-react';
import type {Audience} from './audience';

const comparisons=[
 {name:'Anxiety',text:'Avoiding things or asking for reassurance can happen with anxiety too. An assessment looks at whether the worry is broad and about everyday problems, or is linked to intrusive thoughts and rituals.'},
 {name:'Tic disorders',text:'Tics are repeated movements or sounds that may follow a body urge. Compulsions are often done to reduce fear or doubt, follow a rule, or make something feel “just right.” A child can have both.'},
 {name:'Depression',text:'Low mood can bring withdrawal, indecision, and thoughts that feel stuck. A professional also asks about mood, interest, energy, sleep, and whether rituals are present.'},
 {name:'Eating disorders',text:'Food rules or avoidance can have different reasons. A professional asks whether they are mainly connected to weight or body concerns, contamination fears, harm, or another experience. Conditions can overlap.'},
 {name:'Trauma-related symptoms',text:'After a frightening experience, a child may avoid reminders, watch for danger, or check for safety. An assessment looks at timing, triggers, memories, and the reason behind the behavior.'},
 {name:'Autism-related routines',text:'A routine may feel comfortable, enjoyable, or predictable rather than unwanted and fear-driven. Autistic children can also have OCD, so the child’s own experience matters.'},
] as const;

export default function PediatricDifferences({audience,onAsk}:{audience:Audience;onAsk:(question:string)=>void}){
 const kid=audience==='kid';
 return <section className={`pediatric-differences section pediatric-differences-${audience}`} aria-labelledby="differences-title">
  <div className="differences-intro"><div className="differences-icon"><GitCompareArrows/></div><div><span>{kid?'SAME ACTION, DIFFERENT REASONS':'PEDIATRIC DIFFERENTIAL DIAGNOSIS'}</span><h2 id="differences-title">{kid?'Other things can look similar':'Similar behaviors can have different explanations'}</h2><p>{kid?'Repeating, avoiding, or liking routines does not always mean OCD. A professional listens to what the experience feels like and how it affects your life.':'Routines, repeating, avoidance, reassurance seeking, and “just right” experiences are not specific to OCD. A careful assessment considers what drives the behavior, when it began, its impact, development, health history, and conditions that can overlap.'}</p></div></div>
  <div className="differences-grid">{comparisons.map(item=><article key={item.name}><h3>{item.name}</h3><p>{item.text}</p></article>)}</div>
  <div className="differences-actions"><button onClick={()=>onAsk('How do qualified professionals distinguish pediatric OCD from anxiety, tic disorders, depression, eating disorders, trauma-related symptoms, and autism-related routines?')}>Ask what a professional considers <ArrowRight/></button><a href="https://www.aacap.org/AACAP/Practice/Practice_Parameters/AACAP/Families_and_Youth/Resource_Centers/Obsessive_Compulsive_Disorder_Resource_Center/Home.aspx" target="_blank" rel="noreferrer"><BookOpen/> AACAP OCD Resource Center <span className="sr-only">(opens in a new tab)</span></a></div>
  <p className="differences-note">These comparisons are educational. They cannot tell which explanation applies to one child, and more than one condition can occur together.</p>
 </section>
}
