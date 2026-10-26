import fs from 'node:fs';let s=fs.readFileSync('src/screening/SymptomCheck.tsx','utf8');
s=s.replace("import type {Session} from './model';","import type {Session} from './model';\nimport {OverallResult,UnderstandResults,ScoreHelp,AboutCheck} from './ResultSections';");
s=s.replace('<section className="pattern-summary">','<OverallResult answers={answers} onExplore={onExplore}/><section className="pattern-summary">');
s=s.replace('<div className="dimension-results">','<ScoreHelp/><div className="dimension-results">');
const start=s.indexOf(' <section className="impact-summary">');const end=s.indexOf(' {result.professionalEvaluationFlag?',start);
s=s.slice(0,start)+` <section className="impact-summary"><h2>How much is this affecting your life?</h2><dl>{questions.slice(12).map((question,i)=><div key={question.id}><dt>{['Time occupied','Distress','Interference','Difficulty moving on','Avoidance'][i]}</dt><dd><strong>{i===0?['Less than 5 minutes per day','5–15 minutes per day','15 minutes–1 hour per day','1–3 hours per day','More than 3 hours per day'][answers[question.id]!]:question.options[answers[question.id]!]}</strong></dd></div>)}</dl></section>\n`+s.slice(end);
s=s.replace(' <p className="check-privacy">Research buttons prepare', ' <UnderstandResults answers={answers} onExplore={onExplore}/><AboutCheck onExplore={onExplore}/><p className="check-privacy">Research buttons prepare');
fs.writeFileSync('src/screening/SymptomCheck.tsx',s);
s=fs.readFileSync('src/SourceCard.tsx','utf8').replace('{source.label||source.title||source.filename}</summary>','{source.label||source.title||source.filename}<span className="show-evidence">Show Evidence</span></summary>');fs.writeFileSync('src/SourceCard.tsx',s);
