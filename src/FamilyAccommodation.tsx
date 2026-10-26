import {useState} from 'react';
import {ArrowRight, Check, HeartHandshake, RotateCcw} from 'lucide-react';

const patterns=[
 {id:'reassurance',title:'Repeated reassurance',text:'Answering the same fear or “what if” question many times so your child can feel certain.'},
 {id:'rituals',title:'Helping with rituals',text:'Joining, watching, or helping your child complete checking, cleaning, repeating, or mental rules.'},
 {id:'avoidance',title:'Helping them avoid triggers',text:'Avoiding people, places, objects, words, or activities because they may bring on distress.'},
 {id:'tasks',title:'Doing tasks for them',text:'Taking over ordinary tasks because OCD-related distress makes them feel too difficult.'},
 {id:'routines',title:'Changing family routines',text:'Changing meals, travel, bedtime, schedules, or family plans around OCD-related fears or rituals.'},
] as const;

export default function FamilyAccommodation({onAsk}:{onAsk:(question:string)=>void}){
 const [selected,setSelected]=useState<string[]>([]);const [reviewed,setReviewed]=useState(false);
 const toggle=(id:string)=>{setReviewed(false);setSelected(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])};
 const result=selected.length===0?{title:'No patterns selected',text:'That is okay. Families may still find it useful to notice whether these patterns appear at different times or in different situations.'}:selected.length<=2?{title:'Some family support patterns came up',text:'Families often do these things because they want to reduce a child’s distress. Noticing the pattern can help you prepare a more useful conversation with a qualified professional.'}:{title:'Several family support patterns came up',text:'This does not mean anyone has done something wrong. Families often adapt because a child is distressed. A pediatric OCD professional can help a family decide how to respond gradually and supportively.'};
 return <section className="family-module section" id="family-accommodation">
  <div className="family-module-intro"><span className="family-label"><HeartHandshake/> FAMILY ACCOMMODATION</span><h2>How might OCD be shaping family life?</h2><p>Family accommodation means changing what family members do to reduce a child’s OCD-related distress. These responses usually come from care and a wish to help.</p><aside><strong>This is a reflection, not a parent score.</strong> Do not suddenly remove reassurance or support based on this page. Changes are best planned with a qualified pediatric OCD professional.</aside></div>
  <div className="family-reflection"><div className="family-question"><span>OPTIONAL REFLECTION</span><h3>Which patterns have you noticed?</h3><p>Select any that feel familiar. Nothing is sent to the research assistant.</p></div><div className="family-options">{patterns.map(item=><button type="button" className={selected.includes(item.id)?'selected':''} aria-pressed={selected.includes(item.id)} onClick={()=>toggle(item.id)} key={item.id}><span className="family-check">{selected.includes(item.id)&&<Check/>}</span><span><strong>{item.title}</strong><small>{item.text}</small></span></button>)}</div>
  {!reviewed?<button className="family-review" onClick={()=>setReviewed(true)}>Reflect on these patterns <ArrowRight/></button>:<div className="family-result" role="status"><span>{selected.length} of {patterns.length} selected</span><h3>{result.title}</h3><p>{result.text}</p><div><button onClick={()=>onAsk('What does research say about family accommodation in pediatric OCD, including reassurance, participating in rituals, avoidance, and family routines?')}>Ask what the research says <ArrowRight/></button><button className="family-reset" onClick={()=>{setSelected([]);setReviewed(false)}}><RotateCcw/> Start over</button></div></div>}
  </div>
 </section>;
}
