import { buildPapers, entities, sampleFiles } from './data.ts'
import type { Category } from './data.ts'

// A small view of the same entities and paper relationships as the full graph.
const papers = buildPapers(sampleFiles).slice(0, 4)
const positions = [
 { id: 'codebert', x: 150, y: 115, radius: 25 },
 { id: 'devign', x: 460, y: 95, radius: 22 },
 { id: 'accuracy', x: 505, y: 280, radius: 20 },
 { id: 'language', x: 165, y: 320, radius: 23 },
 { id: 'sample-1', x: 65, y: 225, radius: 14 },
 { id: 'sample-2', x: 300, y: 50, radius: 14 },
 { id: 'sample-3', x: 560, y: 170, radius: 13 },
 { id: 'sample-4', x: 370, y: 370, radius: 14 },
 { id: 'vulnerability', x: 320, y: 205, radius: 52 },
]
export const previewNodes = positions.map(position => {
 const entity = entities.find(e => e.id === position.id)
 const index = papers.findIndex(p => p.id === position.id)
 const paper = papers[index]
 if (!entity && !paper) throw new Error(`Missing preview entity: ${position.id}`)
 return { ...position, label: entity?.label ?? `Paper ${String(index + 1).padStart(2, '0')}`, category: (entity?.category ?? 'Paper') as Category, description: entity?.description ?? paper.title }
})
export const previewEdges = papers.flatMap(paper => paper.entities
 .filter(id => previewNodes.some(node => node.id === id))
 .map(id => ({ source: paper.id, target: id })))
