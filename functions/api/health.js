import {json} from '../../cloudflare/shared.js';

export function onRequestGet({env}){
  return json({configured:!!env.OPENAI_API_KEY&&!!env.OPENAI_VECTOR_STORE_ID,model:env.OPENAI_MODEL||'gpt-5.6-luna'});
}
