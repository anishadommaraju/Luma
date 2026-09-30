import {Fragment, type ReactNode} from 'react';

type Citation={file_id:string;index:number;number:number};

function withCitationMarkers(text:string,citations:Citation[]){
  let marked='';let cursor=0;
  [...citations].sort((a,b)=>a.index-b.index).forEach((citation,i)=>{
    const end=Math.max(cursor,Math.min(citation.index,text.length));
    marked+=text.slice(cursor,end)+`\uE000C:${citation.number}:${i}\uE001`;
    cursor=end;
  });
  return marked+text.slice(cursor);
}

function inline(text:string,prefix:string):ReactNode[]{
  const pattern=/(\uE000C:\d+:\d+\uE001|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|(?<!\*)\*([^*\n]+)\*(?!\*)|(?<!_)_([^_\n]+)_(?!_))/g;
  const nodes:ReactNode[]=[];let cursor=0;let match:RegExpExecArray|null;
  while((match=pattern.exec(text))){
    if(match.index>cursor)nodes.push(text.slice(cursor,match.index));
    const token=match[0];
    if(token.startsWith('\uE000C:')){
      const [,number,ordinal]=token.slice(1,-1).split(':');
      nodes.push(<a className="citation" key={`citation-${number}-${ordinal}-${match.index}`} href={`#${prefix}-${number}`} aria-label={`Open source ${number}`} onClick={()=>{const card=document.getElementById(`${prefix}-${number}`);if(card instanceof HTMLDetailsElement)card.open=true;}}>[{number}]</a>);
    }else if(match[2]&&match[3])nodes.push(<a key={`link-${match.index}`} href={match[3]} target="_blank" rel="noreferrer">{match[2]}</a>);
    else if(match[4])nodes.push(<code key={`code-${match.index}`}>{match[4]}</code>);
    else if(match[5]||match[6])nodes.push(<strong key={`strong-${match.index}`}>{inline(match[5]||match[6],prefix)}</strong>);
    else nodes.push(<em key={`em-${match.index}`}>{inline(match[7]||match[8],prefix)}</em>);
    cursor=match.index+token.length;
  }
  if(cursor<text.length)nodes.push(text.slice(cursor));
  return nodes;
}

export default function MarkdownAnswer({text,citations,prefix}:{text:string;citations:Citation[];prefix:string}){
  const lines=withCitationMarkers(text,citations).replace(/\r\n/g,'\n').split('\n');
  const blocks:ReactNode[]=[];
  for(let i=0;i<lines.length;){
    const line=lines[i].trim();
    if(!line){i++;continue}
    const heading=line.match(/^(#{1,6})\s+(.+)$/);
    if(heading){const level=Math.min(heading[1].length+2,6);const Tag=`h${level}` as 'h3'|'h4'|'h5'|'h6';blocks.push(<Tag key={`heading-${i}`}>{inline(heading[2],prefix)}</Tag>);i++;continue}
    if(/^(\*{3,}|-{3,}|_{3,})$/.test(line)){blocks.push(<hr key={`rule-${i}`}/>);i++;continue}
    if(/^[-*+]\s+/.test(line)){
      const items:ReactNode[]=[];
      while(i<lines.length&&/^[-*+]\s+/.test(lines[i].trim())){items.push(<li key={i}>{inline(lines[i].trim().replace(/^[-*+]\s+/,''),prefix)}</li>);i++}
      blocks.push(<ul key={`list-${i}`}>{items}</ul>);continue;
    }
    if(/^\d+[.)]\s+/.test(line)){
      const items:ReactNode[]=[];
      while(i<lines.length&&/^\d+[.)]\s+/.test(lines[i].trim())){items.push(<li key={i}>{inline(lines[i].trim().replace(/^\d+[.)]\s+/,''),prefix)}</li>);i++}
      blocks.push(<ol key={`list-${i}`}>{items}</ol>);continue;
    }
    if(/^>\s?/.test(line)){
      const quoted:string[]=[];
      while(i<lines.length&&/^>\s?/.test(lines[i].trim())){quoted.push(lines[i].trim().replace(/^>\s?/,''));i++}
      blocks.push(<blockquote key={`quote-${i}`}>{inline(quoted.join(' '),prefix)}</blockquote>);continue;
    }
    const paragraph:string[]=[line];i++;
    while(i<lines.length&&lines[i].trim()&&!/^(#{1,6})\s+|^[-*+]\s+|^\d+[.)]\s+|^>\s?|^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim())){paragraph.push(lines[i].trim());i++}
    blocks.push(<p key={`paragraph-${i}`}>{inline(paragraph.join(' '),prefix)}</p>);
  }
  return <Fragment>{blocks}</Fragment>;
}
