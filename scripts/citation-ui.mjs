import fs from 'node:fs';
let s=fs.readFileSync('src/ResearchChat.tsx','utf8');s=s.replace("import {useEffect,useRef,useState} from 'react';","import {useEffect,useRef,useState} from 'react';\nimport SourceCard from './SourceCard';\nimport type {Source} from './SourceCard';");s=s.replace(/type Source=\{[^\n]+\n/,'');
s=s.replace('aria-label={`Source ${c.number}`}', 'aria-label={`Open source ${c.number}`} onClick={()=>{const card=document.getElementById(`${prefix}-${c.number}`);if(card instanceof HTMLDetailsElement)card.open=true;}}');
s=s.replace('OCD COMPASS</div>','AI-GENERATED EXPLANATION</div>');
const start=s.indexOf('<h4>Sources used</h4>');const end=s.indexOf('</div>}{turn.answer.retrieved',start);
if(start<0||end<0)throw Error('Source section missing');
s=s.slice(0,start)+'<h4>Sources</h4>{turn.answer.sources.map((source,j)=><SourceCard source={source} number={j+1} id={`turn-${i}-${j+1}`} key={source.fileId}/>)}'+s.slice(end);
s=s.replace('All retrieved sources (','Other search evidence · all retrieved sources (');fs.writeFileSync('src/ResearchChat.tsx',s);
