export type DimensionId = 'contamination'|'checking'|'intrusive'|'symmetry';
export const frequency=['Never','Rarely','Sometimes','Often','Very often'];
export const impactScale=['Not at all','A little','Somewhat','Quite a bit','Extremely'];
export const questions=[
 {id:'contamination_worry',text:"In the past 30 days, I had unwanted worries that I, another person, or an object might be contaminated, dirty, or unsafe.",options:frequency},
 {id:'contamination_ritual',text:"I felt driven to wash, clean, disinfect, change clothes, or avoid touching something in order to feel safe or 'clean enough.'",options:frequency},
 {id:'contamination_persistence',text:'Even after cleaning or avoiding something, the worry or feeling of contamination tended to come back.',options:frequency},
 {id:'checking_doubt',text:'I had repeated doubts that I might have made a mistake, forgotten something important, or accidentally caused harm.',options:frequency},
 {id:'checking_ritual',text:'I felt driven to check, repeat an action, ask someone for reassurance, or mentally review what happened.',options:frequency},
 {id:'checking_persistence',text:'Even after checking or getting reassurance, I found that the doubt often returned.',options:frequency},
 {id:'intrusive_thoughts',text:'I experienced unwanted thoughts, images, or urges that felt disturbing, upsetting, or inconsistent with who I am.',options:frequency},
 {id:'intrusive_neutralizing',text:'I felt driven to do something mentally or physically to cancel, neutralize, replace, or get reassurance about these thoughts.',options:frequency},
 {id:'intrusive_avoidance',text:'I avoided certain people, places, situations, or information because I was afraid of having these thoughts or worried about what the thoughts might mean.',options:frequency},
 {id:'symmetry_need',text:'I felt a strong need for things to be arranged, counted, repeated, or done in a particular way.',options:frequency},
 {id:'symmetry_discomfort',text:"I felt uncomfortable, incomplete, or bothered when something did not feel 'just right.'",options:frequency},
 {id:'symmetry_ritual',text:'I repeated, rearranged, counted, or redid something until it felt right or complete.',options:frequency},
 {id:'impact_time',text:'On a typical day, about how much time do these thoughts, behaviors, rituals, checking, avoidance, or mental reviewing take up?',options:['Almost none — less than 5 minutes','A little — 5 to 15 minutes','Noticeable — 15 minutes to 1 hour','A lot — 1 to 3 hours','Very large amount — more than 3 hours']},
 {id:'impact_distress',text:'How much distress, anxiety, discomfort, guilt, fear, or frustration do these experiences cause you?',options:impactScale},
 {id:'impact_interference',text:'How much do these experiences interfere with school, work, home life, friendships, family life, or activities you want to do?',options:impactScale},
 {id:'impact_control',text:'When you try not to perform the behavior, ritual, checking, reassurance seeking, or mental action, how difficult is it to move on without doing it?',options:['Not difficult','A little difficult','Moderately difficult','Very difficult','Extremely difficult']},
 {id:'impact_avoidance',text:'How often do you avoid situations, people, objects, places, or activities because they might trigger these thoughts or behaviors?',options:frequency},
] as const;
export type QuestionId=typeof questions[number]['id'];
export type ScreeningAudience='kid'|'teen'|'caregiver';
const questionText:Record<ScreeningAudience,Record<QuestionId,string>>={
 kid:{
  contamination_worry:'In the past 30 days, did you get worries about germs, dirt, sickness, or something not feeling safe?',
  contamination_ritual:'Did you feel like you had to wash, clean, change clothes, or stay away from something so you could feel safe or clean enough?',
  contamination_persistence:'After you cleaned or stayed away from something, did the worry come back?',
  checking_doubt:'Did you keep worrying that you made a mistake, forgot something, or might have caused something bad to happen?',
  checking_ritual:'Did you feel like you had to check, do something again, ask someone if things were okay, or go over it in your mind?',
  checking_persistence:'After checking or asking someone, did the worry come back?',
  intrusive_thoughts:'Did unwanted or scary thoughts, pictures in your mind, or feelings pop up even though you did not want them?',
  intrusive_neutralizing:'Did you feel like you had to think, say, or do something to make an unwanted thought feel better or go away?',
  intrusive_avoidance:'Did you stay away from people, places, or activities because you were worried an unwanted thought might show up?',
  symmetry_need:'Did you feel like things had to be lined up, counted, repeated, or done in a certain way?',
  symmetry_discomfort:'Did it bother you when something did not feel “just right” or finished?',
  symmetry_ritual:'Did you repeat, arrange, count, or redo something until it felt right?',
  impact_time:'On a usual day, how much time did these worries or repeated actions take?',
  impact_distress:'How upset, scared, guilty, frustrated, or uncomfortable did these experiences make you feel?',
  impact_interference:'How much did these experiences get in the way of school, home, friends, play, sleep, or things you wanted to do?',
  impact_control:'When you tried to move on without checking, repeating, asking, or doing the action, how hard was it?',
  impact_avoidance:'How often did you stay away from people, places, things, or activities because they might bring on the worry or action?',
 },
 teen:{
  contamination_worry:'In the past 30 days, did you have unwanted worries that you, another person, or an object might be contaminated, dirty, or unsafe?',
  contamination_ritual:'Did you feel driven to wash, clean, disinfect, change clothes, or avoid touching something to feel safe or “clean enough”?',
  contamination_persistence:'Even after cleaning or avoiding something, did the contamination worry or feeling tend to return?',
  checking_doubt:'Did you have repeated doubts that you made a mistake, forgot something important, or accidentally caused harm?',
  checking_ritual:'Did you feel driven to check, repeat an action, ask for reassurance, or mentally review what happened?',
  checking_persistence:'Even after checking or getting reassurance, did the doubt tend to return?',
  intrusive_thoughts:'Did you experience unwanted thoughts, images, or urges that felt disturbing, upsetting, or unlike who you are?',
  intrusive_neutralizing:'Did you feel driven to do something mentally or physically to cancel, replace, or get reassurance about these thoughts?',
  intrusive_avoidance:'Did you avoid people, places, situations, or information because you feared having these thoughts or worried about what they meant?',
  symmetry_need:'Did you feel a strong need for things to be arranged, counted, repeated, or done in a particular way?',
  symmetry_discomfort:'Did you feel uncomfortable, incomplete, or bothered when something did not feel “just right”?',
  symmetry_ritual:'Did you repeat, rearrange, count, or redo something until it felt right or complete?',
  impact_time:'On a typical day, how much time did these thoughts, rituals, checking, avoidance, or mental reviewing take?',
  impact_distress:'How much distress, anxiety, discomfort, guilt, fear, or frustration did these experiences cause?',
  impact_interference:'How much did these experiences interfere with school, home, friendships, family life, sleep, or activities you wanted to do?',
  impact_control:'When you tried not to do the ritual, checking, reassurance seeking, or mental action, how difficult was it to move on?',
  impact_avoidance:'How often did you avoid people, objects, places, situations, or activities because they might trigger these experiences?',
 },
 caregiver:{
  contamination_worry:'In the past 30 days, my child seemed worried that they, another person, or an object might be contaminated, dirty, or unsafe.',
  contamination_ritual:'My child washed, cleaned, disinfected, changed clothes, or avoided touching something to feel safe or “clean enough.”',
  contamination_persistence:'Even after cleaning or avoiding something, my child’s contamination worry or discomfort seemed to return.',
  checking_doubt:'My child expressed repeated doubts about making a mistake, forgetting something important, or accidentally causing harm.',
  checking_ritual:'My child checked, repeated an action, asked for reassurance, or mentally reviewed what happened.',
  checking_persistence:'Even after checking or receiving reassurance, my child’s doubt seemed to return.',
  intrusive_thoughts:'My child told me about, or I noticed signs of, unwanted thoughts, images, or urges that felt disturbing or unlike who they are.',
  intrusive_neutralizing:'My child appeared driven to think, say, or do something to cancel, replace, or get reassurance about an unwanted thought.',
  intrusive_avoidance:'My child avoided people, places, situations, or information because of unwanted thoughts or worries about what those thoughts might mean.',
  symmetry_need:'My child seemed to need things arranged, counted, repeated, or done in a particular way.',
  symmetry_discomfort:'My child seemed uncomfortable or incomplete when something did not feel “just right.”',
  symmetry_ritual:'My child repeated, rearranged, counted, or redid something until it felt right or complete.',
  impact_time:'On a typical day, about how much time did these experiences appear to take for your child?',
  impact_distress:'How much distress, anxiety, discomfort, guilt, fear, or frustration did these experiences appear to cause your child?',
  impact_interference:'How much did these experiences interfere with your child’s school, home life, friendships, family life, sleep, or activities?',
  impact_control:'When your child tried to move on without the behavior, checking, reassurance, or mental action, how difficult did it seem?',
  impact_avoidance:'How often did your child avoid people, objects, places, situations, or activities because they might trigger these experiences?',
 }
};
export function questionsForAudience(audience:ScreeningAudience){
 const frequencyOptions=audience==='kid'?['Never','Once in a while','Sometimes','A lot','Almost all the time']:audience==='caregiver'?['Not noticed','Rarely','Sometimes','Often','Very often']:frequency;
 const impactOptions=audience==='kid'?['Not at all','A little','Some','A lot','A whole lot']:impactScale;
 return questions.map(q=>{let options:readonly string[]=q.options;if(q.id==='impact_time')options=audience==='kid'?['Almost none — less than 5 minutes','A little — 5 to 15 minutes','Some — 15 minutes to 1 hour','A lot — 1 to 3 hours','A very large amount — more than 3 hours']:q.options;else if(q.id==='impact_distress'||q.id==='impact_interference')options=impactOptions;else if(q.id==='impact_control')options=audience==='kid'?['Not hard','A little hard','Kind of hard','Very hard','Extremely hard']:q.options;else options=frequencyOptions;return {...q,text:questionText[audience][q.id],options}});
}
export type ScreeningAnswers=Record<QuestionId,number>;
export type DraftAnswers=Partial<ScreeningAnswers>;
export const dimensions: {id:DimensionId;label:string;keys:QuestionId[];description:string;button:string;prompt:string}[]=[
 {id:'contamination',label:'Contamination & Cleaning',keys:['contamination_worry','contamination_ritual','contamination_persistence'],description:'This pattern can involve unwanted concerns about germs, contamination, illness, dirt, or feeling contaminated, together with cleaning, washing, avoidance, or other actions used to reduce the discomfort.',button:'Ask why contamination fears can become repetitive →',prompt:'What does research say about why contamination fears and cleaning rituals can become repetitive in OCD?'},
 {id:'checking',label:'Responsibility, Doubt & Checking',keys:['checking_doubt','checking_ritual','checking_persistence'],description:'This pattern can involve repeated uncertainty about mistakes, safety, or responsibility for preventing harm, followed by checking, reassurance seeking, repeating, or mentally reviewing events.',button:'Ask why checking only helps temporarily →',prompt:'What does research say about why checking and reassurance may only reduce doubt temporarily in OCD?'},
 {id:'intrusive',label:'Unwanted Intrusive Thoughts',keys:['intrusive_thoughts','intrusive_neutralizing','intrusive_avoidance'],description:"This pattern can involve unwanted thoughts, images, or urges that feel disturbing or inconsistent with a person's values, together with attempts to suppress, neutralize, avoid, or get reassurance about them.",button:'Ask what research says about intrusive thoughts →',prompt:'What does research say about unwanted intrusive thoughts, neutralizing rituals, and the distinction between thoughts and intentions?'},
 {id:'symmetry',label:'Symmetry & "Just Right" Feelings',keys:['symmetry_need','symmetry_discomfort','symmetry_ritual'],description:"This pattern can involve a strong need for things to feel complete, balanced, exact, or 'just right,' followed by arranging, counting, repeating, or redoing actions.",button:'Ask why things sometimes need to feel "just right" →',prompt:'What does research say about symmetry, repeating, and just right feelings in OCD?'},
];
export type DimensionResult={id:DimensionId;label:string;score:number;maxScore:12;percentage:number};
export type ScreeningResult={dimensions:DimensionResult[];impactScore:number;maxImpactScore:20;professionalEvaluationFlag:boolean;primaryDimension:DimensionId|null;primaryDimensions:DimensionId[]};
export function validValue(value:unknown):value is number{return typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<=4}
export function isComplete(answers:DraftAnswers):answers is ScreeningAnswers{return questions.every(q=>validValue(answers[q.id]))}
export function scoreAnswers(answers:DraftAnswers):ScreeningResult{
 if(!isComplete(answers))throw Error('All 17 questions require a response from 0 to 4.');
 const results=dimensions.map(d=>{const score=d.keys.reduce((sum,key)=>sum+answers[key],0);return {id:d.id,label:d.label,score,maxScore:12 as const,percentage:Math.round(score/12*100)}}).sort((a,b)=>b.score-a.score);
 const highest=results[0].score;const primaryDimensions=highest===0?[]:results.filter(d=>d.score===highest).map(d=>d.id);
 return {dimensions:results,impactScore:questions.slice(12).reduce((sum,q)=>sum+answers[q.id],0),maxImpactScore:20,professionalEvaluationFlag:['impact_time','impact_distress','impact_interference','impact_control'].some(key=>answers[key as QuestionId]>=3),primaryDimension:primaryDimensions.length===1?primaryDimensions[0]:null,primaryDimensions};
}
export const storageKey='ocd-compass-symptom-check-v1';
export type Session={answers:DraftAnswers;step:number;started:boolean};
export function parseSession(raw:string|null):Session{
 const empty={answers:{},step:0,started:false};if(!raw)return empty;
 try{const data=JSON.parse(raw);if(data.version!==1||!data.answers||typeof data.answers!=='object')return empty;
 const answers:DraftAnswers={};for(const q of questions)if(validValue(data.answers[q.id]))answers[q.id]=data.answers[q.id];
 return {answers,step:Number.isInteger(data.step)?Math.max(0,Math.min(16,data.step)):0,started:data.started===true};}catch{return empty}
}
export type ResultState='few'|'some'|'impact';
export function resultState(answers:DraftAnswers):ResultState{
 const result=scoreAnswers(answers);
 if(result.professionalEvaluationFlag)return 'impact';
 return result.dimensions.every(d=>d.score<=2)&&questions.slice(12).every(q=>answers[q.id]!<=1)?'few':'some';
}
export function suggestedResearch(answers:DraftAnswers){
 const result=scoreAnswers(answers);
 return result.primaryDimensions.length?dimensions.filter(d=>result.primaryDimensions.includes(d.id)).map(d=>({label:d.label,question:d.prompt})):[{label:'What OCD is',question:'What is OCD, and how are obsessions and compulsions professionally assessed?'}];
}
