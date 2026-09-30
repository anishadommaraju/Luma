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
