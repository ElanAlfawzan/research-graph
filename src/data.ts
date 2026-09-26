export type Category = 'Paper' | 'Research topic' | 'Method' | 'Dataset' | 'Finding' | 'Limitation'
export interface Entity { id: string; label: string; category: Exclude<Category, 'Paper'>; description: string }
export interface UploadedFile { id: string; name: string; size: number; lastModified: number }
export interface Paper extends UploadedFile { title: string; authors: string; year: string; venue: string; objective: string; entities: string[]; context: string; sample: boolean }
export const categoryStyles: Record<Category, {color:string; bg:string}> = {
 Paper:{color:'#71889d',bg:'#eaf0f5'}, 'Research topic':{color:'#375f76',bg:'#e5eff3'}, Method:{color:'#638eb8',bg:'#eaf2fb'}, Dataset:{color:'#9c85ba',bg:'#f0eaf8'}, Finding:{color:'#68a394',bg:'#eaf5f0'}, Limitation:{color:'#c39477',bg:'#faf0e9'},
}
export const entities: Entity[] = [
 ['vulnerability','Vulnerability Detection','Research topic','Identifying security weaknesses in source code.'],
 ['security','Software Security','Research topic','Understanding and reducing software security risks.'],
 ['program','Program Analysis','Research topic','Reasoning about the structure and behavior of code.'],
 ['repair','Automated Code Repair','Research topic','Exploring suggestions for repairing vulnerable code.'],
 ['contracts','Smart Contract Security','Research topic','Examining vulnerabilities in smart contract code.'],
 ['codebert','CodeBERT','Method','A code representation model used in four fictional studies in the complete demo collection.'],
 ['gnn','Graph Neural Networks','Method','Models that represent relationships within program graphs.'],
 ['llm','Large Language Models','Method','Language models used to reason about code and vulnerability context.'],
 ['static','Static Analysis','Method','Inspection of source code without executing a program.'],
 ['transformer','Transformer Models','Method','Attention-based models for learning code representations.'],
 ['devign','Devign','Dataset','A vulnerability detection benchmark referenced in this illustrative collection.'],
 ['juliet','Juliet','Dataset','A test-suite benchmark referenced in this illustrative collection.'],
 ['cwe','CWE-related datasets','Dataset','Illustrative weakness-focused evaluation collections.'],
 ['repositories','Real-world repositories','Dataset','Selected repository examples in the fictional demo studies.'],
 ['accuracy','Improved Accuracy','Finding','An illustrative relative improvement within the demo evaluation setting; no measured statistics are claimed.'],
 ['false-positives','Reduced False Positives','Finding','A fictional study outcome suggesting fewer false alarms in a bounded setting.'],
 ['context','Better Context Understanding','Finding','An illustrative observation of better use of surrounding code context.'],
 ['generalization','Limited Generalization','Finding','A demo observation that performance may not transfer across settings.'],
 ['bias','Dataset Bias','Limitation','The evaluation collection may not represent broader development contexts.'],
 ['language','Limited Language Diversity','Limitation','Evaluation covers a narrow set of programming-language environments.'],
 ['scope','Small Evaluation Scope','Limitation','Evidence comes from a bounded set of evaluation cases.'],
 ['realworld','Limited Real-world Validation','Limitation','Limited evaluation in operational repository settings.'],
].map(([id,label,category,description])=>({id,label,category:category as Entity['category'],description}))
const templates = [
 {title:'Context-aware vulnerability detection with code representations',objective:'Explore how contextual code representations support vulnerability detection.',entities:['vulnerability','security','codebert','devign','accuracy','context','language','bias'],context:'Benchmark-based vulnerability detection'},
 {title:'Learning vulnerability patterns from program graphs',objective:'Explore structural program representations for detecting vulnerable code.',entities:['vulnerability','program','gnn','juliet','accuracy','language','scope'],context:'Common vulnerability benchmark'},
 {title:'Transformer models for source code security analysis',objective:'Compare attention-based representations in a bounded benchmark setting.',entities:['security','vulnerability','codebert','transformer','juliet','context','language','realworld'],context:'Benchmark evaluation with limited language coverage'},
 {title:'Cross-dataset transfer in vulnerability classification',objective:'Explore whether a model transfers between vulnerability benchmarks.',entities:['vulnerability','codebert','devign','juliet','generalization','bias','language'],context:'Cross-benchmark generalization'},
 {title:'Language models for vulnerability explanation and repair',objective:'Explore contextual explanations and candidate repairs for vulnerable code.',entities:['repair','llm','repositories','context','scope','realworld'],context:'Selected public repository examples'},
 {title:'Combining static analysis with learned code features',objective:'Explore whether learned features complement static analysis signals.',entities:['program','security','codebert','static','cwe','false-positives','language','realworld'],context:'Weakness-focused benchmark evaluation'},
 {title:'Graph representations for smart contract security',objective:'Explore program graphs in a bounded smart contract setting.',entities:['contracts','gnn','cwe','accuracy','scope','realworld'],context:'Selected smart contract cases'},
 {title:'Evaluating learned detectors beyond familiar benchmarks',objective:'Explore how evaluation context affects vulnerability model behavior.',entities:['vulnerability','transformer','devign','generalization','language','bias','realworld'],context:'Generalization beyond familiar benchmark contexts'},
]
export { sampleFiles } from './sample-files.ts'
export function buildPapers(files: UploadedFile[]): Paper[] {return files.map((file,i)=>{const match=file.name.match(/^research-graph-demo-(0[1-8])\.pdf$/);const t=templates[match?Number(match[1])-1:i%templates.length];return {...file,...t,authors:'Fictional demo research team',year:'Demo · no publication year',venue:'Illustrative study · not a published paper',sample:!!match}})}
export const entityById = (id:string)=>entities.find(e=>e.id===id)
export const paperEntities = (paper:Paper,category?:Category)=>paper.entities.map(entityById).filter((e):e is Entity=>!!e&&(!category||e.category===category))
export interface Insight {id:string;type:'Potential Research Gaps'|'Conflicting Findings'|'Underexplored Areas'|'Patterns & Trends';title:string;summary:string;reasoning:string;entityIds:string[];directions:string[];question:string}
export const insights: Insight[] = [
 {id:'languages',type:'Potential Research Gaps',title:'Limited evaluation on multilingual or diverse programming-language codebases',summary:'Within the analyzed demo collection, evaluations are concentrated around familiar benchmarks and programming contexts, with limited evidence for broader language settings.',reasoning:'Repeated language-diversity limitations connect several demo papers using different methods and benchmarks. This suggests a collection-level opportunity to broaden evaluation; it does not establish novelty.',entityIds:['language','codebert','gnn','transformer','devign','juliet'],directions:['Evaluate existing vulnerability detection models across diverse programming languages.','Compare model generalization across programming-language ecosystems.','Investigate language-specific vulnerability patterns.','Evaluate performance across real-world repositories.'],question:'How consistently do AI-based vulnerability detection models generalize across different programming languages and diverse code repositories?'},
 {id:'real-world',type:'Potential Research Gaps',title:'Limited real-world repository evaluation',summary:'Benchmark-focused evaluations are common in the demo collection, while operational repository validation remains limited.',reasoning:'Real-world validation limitations recur across the supporting demo records. Repository examples are present, but they do not represent broad operational validation.',entityIds:['realworld','repositories','llm','static'],directions:['Evaluate detectors on continuously evolving repositories.','Compare benchmark behavior with developer-reviewed vulnerability reports.','Study performance across project sizes and development contexts.'],question:'How well do benchmark-trained vulnerability detectors transfer to operational repository settings?'},
 {id:'comparison',type:'Potential Research Gaps',title:'Limited direct comparison between LLM-based and traditional vulnerability detection approaches',summary:'The demo collection includes both language models and static analysis, but offers limited evidence of matched comparisons.',reasoning:'The LLM and static-analysis demo studies use different evaluation contexts. Their records do not support a controlled head-to-head conclusion.',entityIds:['llm','static','scope','realworld'],directions:['Compare LLM-based and static-analysis approaches on the same evaluation cases.','Align evaluation metrics and developer-review criteria.','Examine complementary strengths in hybrid workflows.'],question:'Under matched evaluation conditions, how do language models and static analysis compare?'},
 {id:'conflict',type:'Conflicting Findings',title:'Model performance varies across evaluation settings',summary:'One group of demo studies suggests stronger within-benchmark performance; another highlights limited transfer across benchmarks.',reasoning:'Paper Group A reports illustrative within-benchmark improvements. Paper Group B describes limited generalization. Different datasets, metrics, or experimental settings may explain the apparent conflict.',entityIds:['accuracy','generalization','devign','juliet'],directions:['Compare methods using identical dataset splits.','Report cross-dataset evaluation alongside within-benchmark results.'],question:'How much of the apparent performance difference is explained by evaluation design?'},
 {id:'underexplored',type:'Underexplored Areas',title:'Cross-dataset generalization and less common language ecosystems',summary:'Multilingual codebases, real-world repositories, and less common programming languages are underrepresented within the analyzed demo collection.',reasoning:'Recurring limitations point toward contexts that have limited representation in these uploaded demo records.',entityIds:['language','generalization','realworld'],directions:['Build evaluation collections across language ecosystems.','Test cross-dataset generalization in diverse repositories.'],question:'Which underrepresented development contexts most affect model transfer?'},
 {id:'patterns',type:'Patterns & Trends',title:'Shared benchmarks connect different modeling approaches',summary:'Common datasets connect code representation, graph, and transformer methods throughout the demo collection.',reasoning:'The graph shows several method-to-paper-to-dataset paths converging on Devign and Juliet. This is a pattern within the collection, not a claim about the wider literature.',entityIds:['devign','juliet','codebert','gnn','transformer'],directions:['Compare the evaluation assumptions shared by these studies.','Investigate whether benchmark overlap masks similar limitations.'],question:'How does shared benchmark selection shape conclusions across different methods?'},
]
export function supportingPapers(insight:Insight,papers:Paper[]) {const criteria:Record<string,string[]>={languages:['language'],'real-world':['realworld'],comparison:['llm','static'],conflict:['accuracy','generalization'],underexplored:['language','generalization','realworld'],patterns:['devign','juliet']};return papers.filter(p=>p.entities.some(e=>(criteria[insight.id]??insight.entityIds).includes(e)))}
export function graphFocus(id:string,papers:Paper[]):Set<string>{const paper=papers.find(p=>p.id===id);if(paper)return new Set([id,...paper.entities]);const related=papers.filter(p=>p.entities.includes(id));return new Set([id,...related.map(p=>p.id),...related.flatMap(p=>p.entities)])}
export const analysisStages=['Reading uploaded papers','Extracting research topics','Identifying methods and models','Identifying datasets','Extracting findings','Extracting limitations','Building research connections','Generating Knowledge Graph']

export function availableInsights(papers: Paper[]): Insight[] {
 const contains = (id: string) => papers.some(p => p.entities.includes(id))
 return insights.filter(insight => {
  if (insight.id === 'comparison') return contains('llm') && contains('static')
  if (insight.id === 'conflict') return contains('accuracy') && contains('generalization')
  return supportingPapers(insight, papers).length >= 2
 })
}
