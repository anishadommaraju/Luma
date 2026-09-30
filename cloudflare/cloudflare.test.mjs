import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestGet as health} from '../functions/api/health.js';
import {onRequestPost as chat} from '../functions/api/chat.js';
import {OUT_OF_SCOPE_MESSAGE,parseResponse,requestBody} from './shared.js';
import worker from '../worker/index.js';

test('Cloudflare health reads only server-side bindings',async()=>{
  const response=health({env:{OPENAI_API_KEY:'secret',OPENAI_VECTOR_STORE_ID:'vs_test',OPENAI_MODEL:'model'}});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{configured:true,model:'model'});
});

test('Cloudflare chat rejects cross-origin and malformed requests before OpenAI',async()=>{
  const crossOrigin=await chat({request:new Request('https://ocd-compass.pages.dev/api/chat',{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:'{}'}),env:{}});
  assert.equal(crossOrigin.status,403);
  const malformed=await chat({request:new Request('https://ocd-compass.pages.dev/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:'nope'}),env:{}});
  assert.equal(malformed.status,400);
});

test('Cloudflare request keeps retrieval required and accepts model out-of-scope reply',()=>{
  const body=requestBody('how to make ice cream',[],'vs_test','model');
  assert.equal(body.tool_choice,'required');
  assert.equal(JSON.parse(body.input).question,'how to make ice cream');
  const parsed=parseResponse({status:'completed',output:[{type:'file_search_call',status:'completed',results:[]},{type:'message',content:[{type:'output_text',text:OUT_OF_SCOPE_MESSAGE,annotations:[]}]}]});
  assert.equal(parsed.outOfScope,true);
  assert.equal(parsed.segments[0].text,OUT_OF_SCOPE_MESSAGE);
});

test('Worker routes API calls and leaves static routes to the asset binding',async()=>{
  const env={OPENAI_API_KEY:'secret',OPENAI_VECTOR_STORE_ID:'vs_test',ASSETS:{fetch:request=>new Response(`asset:${new URL(request.url).pathname}`)}};
  const healthResponse=await worker.fetch(new Request('https://ocd.example/api/health'),env);
  assert.equal(healthResponse.status,200);
  const missingResponse=await worker.fetch(new Request('https://ocd.example/api/missing'),env);
  assert.equal(missingResponse.status,404);
  const assetResponse=await worker.fetch(new Request('https://ocd.example/about'),env);
  assert.equal(await assetResponse.text(),'asset:/about');
});
