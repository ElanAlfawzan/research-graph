import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { JSDOM } from 'jsdom'
import React, { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
const dom = new JSDOM('<!doctype html><body></body>',{url:'http://localhost/'})
globalThis.window=dom.window
globalThis.document=dom.window.document
globalThis.HTMLElement=dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT=true
await mkdir('tests/.tmp',{recursive:true})
const temp=await mkdtemp(resolve('tests/.tmp/upload-'))
const compiled=resolve(temp,'Upload.mjs')
await build({entryPoints:['src/components/Upload.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',outfile:compiled})
const {default:Upload}=await import(pathToFileURL(compiled).href)
after(async()=>{dom.window.close();await rm(temp,{recursive:true,force:true})})
async function mount(){
 const host=document.createElement('div');document.body.append(host)
 const root=createRoot(host)
 let analyzed=0
 function Harness(){const [files,setFiles]=useState([]);return React.createElement(Upload,{files,setFiles,onAnalyze:()=>analyzed++})}
 await act(async()=>root.render(React.createElement(Harness)))
 const dropzone=()=>host.querySelector('[data-testid="dropzone"]')
 const button=label=>[...host.querySelectorAll('button')].find(b=>b.textContent===label)
 const send=(target,type,files=[])=>{const event=new dom.window.Event(type,{bubbles:true,cancelable:true});Object.defineProperty(event,'dataTransfer',{value:{files}});target.dispatchEvent(event);return event}
 async function drop(files){await act(async()=>{send(dropzone(),'drop',files);await new Promise(setImmediate)})}
 return {host,dropzone,button,send,drop,get analyzed(){return analyzed},async close(){await act(async()=>root.unmount());host.remove()}}
}
async function fixture(number){const name=`research-graph-demo-${String(number).padStart(2,'0')}.pdf`;return new File([await readFile(`public/demo-papers/${name}`)],name,{type:'application/pdf'})}
test('drop handler accepts eight PDFs, renders them, enables analysis and supports removal',async()=>{
 const ui=await mount()
 try{
  assert.equal(ui.button('Analyze Papers').disabled,true)
  await ui.drop(await Promise.all(Array.from({length:8},(_,i)=>fixture(i+1))))
  assert.equal(ui.host.querySelectorAll('.upload-row').length,8)
  assert.match(ui.host.textContent,/8 papers ready for analysis/)
  assert.equal(ui.button('Analyze Papers').disabled,false)
  await act(async()=>ui.button('Analyze Papers').click());assert.equal(ui.analyzed,1)
  await act(async()=>ui.host.querySelector('[aria-label="Remove research-graph-demo-01.pdf"]').click())
  assert.equal(ui.host.querySelectorAll('.upload-row').length,7)
 }finally{await ui.close()}
})
test('actual PDF dropped after the sample shortcut is rejected as a duplicate',async()=>{
 const ui=await mount()
 try{
  await act(async()=>ui.button('Use Demo Collection').click())
  await ui.drop([await fixture(1)])
  assert.equal(ui.host.querySelectorAll('.upload-row').length,8)
  assert.match(ui.host.querySelector('[role="alert"]').textContent,/already added/)
 }finally{await ui.close()}
})
test('invalid drop shows friendly errors and cannot start an empty analysis',async()=>{
 const ui=await mount()
 try{
  await ui.drop([new File(['notes'],'notes.txt'),new File(['not a PDF'],'fake.pdf'),new File([],'empty.pdf')])
  assert.equal(ui.host.querySelectorAll('.upload-row').length,0)
  assert.equal(ui.host.querySelectorAll('[role="alert"] p').length,3)
  assert.equal(ui.button('Analyze Papers').disabled,true)
 }finally{await ui.close()}
})
test('drag highlight remains active across child elements and clears on leaving or dropping',async()=>{
 const ui=await mount()
 try{
  await act(async()=>ui.send(ui.dropzone(),'dragenter'))
  await act(async()=>{ui.send(ui.host.querySelector('.upload-symbol'),'dragenter');ui.send(ui.host.querySelector('.upload-symbol'),'dragleave')})
  assert.equal(ui.dropzone().classList.contains('dragging'),true)
  await act(async()=>ui.send(ui.dropzone(),'dragleave'))
  assert.equal(ui.dropzone().classList.contains('dragging'),false)
  await act(async()=>ui.send(ui.dropzone(),'dragenter'))
  await ui.drop([await fixture(1)])
  assert.equal(ui.dropzone().classList.contains('dragging'),false)
 }finally{await ui.close()}
})
test('demo collection is bundled, repeatable, and uses the normal Analyze Papers action',async()=>{
 const ui=await mount()
 try{
  assert.equal(ui.host.querySelectorAll('.upload-row').length,0)
  await act(async()=>ui.button('Use Demo Collection').click())
  assert.equal(ui.host.querySelectorAll('.upload-row').length,8)
  assert.equal(ui.button('Analyze Papers').disabled,false)
  await act(async()=>ui.button('Use Demo Collection').click())
  assert.equal(ui.host.querySelectorAll('.upload-row').length,8)
  assert.equal(ui.host.querySelectorAll('[role="alert"]').length,0)
  await act(async()=>ui.button('Analyze Papers').click())
  assert.equal(ui.analyzed,1)
 }finally{await ui.close()}
})
