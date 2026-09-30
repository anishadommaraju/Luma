import {onRequestGet as health} from '../functions/api/health.js';
import {onRequestGet as rejectChatGet,onRequestPost as chat} from '../functions/api/chat.js';
import {json} from '../cloudflare/shared.js';

export default {
  async fetch(request,env){
    const {pathname}=new URL(request.url);
    if(pathname==='/api/health')return request.method==='GET'?health({request,env}):json({error:'Method not allowed.'},405);
    if(pathname==='/api/chat')return request.method==='POST'?chat({request,env}):rejectChatGet({request,env});
    if(pathname.startsWith('/api/'))return json({error:'Not found.'},404);
    return env.ASSETS.fetch(request);
  }
};
