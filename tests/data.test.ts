import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPapers, restorePapers, availableInsights, entities, insights, sampleFiles, supportingPapers, graphFocus } from '../src/data.ts'
import { validateFiles, MAX_FILE_BYTES } from '../src/upload.ts'
const papers = buildPapers(sampleFiles)
test('complete demo graph has eight distinct papers and no dangling entity references',()=>{
 assert.equal(papers.length,8)
 assert.equal(new Set(papers.map(p=>p.id)).size,8)
 for(const paper of papers)for(const id of paper.entities)assert.ok(entities.some(e=>e.id===id),id)
})
test('CodeBERT connects four demo studies and their evidence',()=>{
 const focus=graphFocus('codebert',papers)
 assert.equal(papers.filter(p=>focus.has(p.id)).length,4)
 for(const id of ['devign','juliet','context','language'])assert.ok(focus.has(id))
 assert.ok(!focus.has(papers[4].id))
})
test('language opportunity evidence is exactly the six matching uploaded studies',()=>{
 const gap=insights.find(i=>i.id==='languages')!
 assert.equal(supportingPapers(gap,papers).length,6)
 assert.equal(supportingPapers(gap,[papers[4]]).length,0)
 assert.equal(supportingPapers(gap,[papers[0]]).length,1)
})
test('filename mapping remains stable when samples are uploaded in a different order',()=>{
 const reversed=buildPapers([...sampleFiles].reverse())
 assert.equal(reversed[0].title,papers[7].title)
 const arbitrary=buildPapers([{...sampleFiles[0],name:'my-paper.pdf'}])
 assert.equal(arbitrary.length,1)
 assert.equal(arbitrary[0].sample,false)
 assert.equal(arbitrary[0].authors,'Fictional demo research team')
})
test('upload accepts multiple PDFs and rejects duplicates across and within batches',async()=>{
 const one=new File(['%PDF-1.4\nfixture'],'one.pdf')
 const two=new File(['%PDF-1.4\nfixture'],'two.pdf')
 const first=await validateFiles([one,two,one],[])
 assert.equal(first.files.length,2);assert.match(first.errors[0],/already added/)
 const second=await validateFiles([two],first.files)
 assert.equal(second.files.length,2);assert.match(second.errors[0],/already added/)
})
test('upload handles unsupported, renamed, empty, oversized, and unreadable files',async()=>{
 const oversized=new File([new Uint8Array(MAX_FILE_BYTES+1)],'large.pdf')
 const result=await validateFiles([new File(['hello'],'notes.txt'),new File(['hello'],'fake.pdf'),new File([],'empty.pdf'),oversized],[])
 assert.equal(result.files.length,0);assert.equal(result.errors.length,4)
 assert.match(result.errors.join(' '),/20 MB/)
})
test('empty selections are harmless and a collection is capped at 24 papers',async()=>{
 assert.deepEqual(await validateFiles([],[]),{files:[],errors:[]})
 const input=Array.from({length:25},(_,i)=>new File(['%PDF-1.4'],`paper-${i}.pdf`))
 const result=await validateFiles(input,[])
 assert.equal(result.files.length,24);assert.match(result.errors[0],/24 papers/)
})

test('partial collections do not claim comparisons that lack supporting records',async()=>{
 const { availableInsights } = await import('../src/data.ts')
 assert.equal(availableInsights(papers).length,6)
 assert.equal(availableInsights([papers[0]]).length,0)
 assert.ok(!availableInsights(papers.filter(p=>!p.entities.includes('llm'))).some(i=>i.id==='comparison'))
})

test('first launch and empty or invalid storage show the complete bundled prototype',()=>{
 for (const saved of [null, '[]', '{}', 'invalid json', '[null,{"name":"incomplete.pdf"}]']) {
  const initial = restorePapers(saved)
  assert.equal(initial.length,8)
  assert.equal(availableInsights(initial).length,6)
  assert.equal(supportingPapers(insights.find(i=>i.id==='languages')!,initial).length,6)
 }
})
test('startup preserves a saved user collection instead of replacing it with the demo',()=>{
 const files=[{id:'user-1',name:'my-research.pdf',size:1200,lastModified:42}]
 assert.deepEqual(restorePapers(JSON.stringify(files)),buildPapers(files))
 assert.notEqual(restorePapers(null),restorePapers(null))
})
