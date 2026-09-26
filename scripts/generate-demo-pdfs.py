"""Regenerate fictional, one-page upload fixtures. Requires reportlab and pymupdf."""
from pathlib import Path
import re, zipfile, json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
root = Path(__file__).resolve().parent.parent
source = (root / 'src/data.ts').read_text()
records = re.findall(r"\{title:'([^']+)',objective:'([^']+)',entities:\[([^\]]+)\],context:'([^']+)'\}", source)
entity_labels = dict(re.findall(r"\['([^']+)','([^']+)','(?:Research topic|Method|Dataset|Finding|Limitation)'", source))
out = root / 'public/demo-papers'
out.mkdir(parents=True, exist_ok=True)
for i, (title, objective, entities, context) in enumerate(records, 1):
    path = out / f'research-graph-demo-{i:02d}.pdf'
    c = canvas.Canvas(str(path), pagesize=(612, 792))
    c.setTitle(f'Research Graph - Fictional Demo Study {i:02d}')
    c.setAuthor('Research Graph prototype - fictional demo research team')
    c.setFillColor(HexColor('#192a37')); c.rect(0, 690, 612, 102, fill=1, stroke=0)
    c.setFillColor(HexColor('#ffffff')); c.setFont('Helvetica-Bold', 20)
    c.drawString(44, 744, 'research graph')
    c.setFillColor(HexColor('#b6c9d7')); c.setFont('Helvetica', 9)
    c.drawString(44, 721, f'FICTIONAL DEMO STUDY {i:02d}  /  UPLOAD FIXTURE')
    y = 650
    def para(text, size=11, color='#6c8090', leading=18):
        global y
        c.setFillColor(HexColor(color)); c.setFont('Helvetica', size)
        for line in simpleSplit(text, 'Helvetica', size, 518):
            c.drawString(44, y, line); y -= leading
        y -= 12
    def label(text):
        global y
        c.setFillColor(HexColor('#355b72')); c.setFont('Helvetica-Bold', 10)
        c.drawString(44, y, text); y -= 23
    para(title, 22, '#294c64', 29)
    para('This is a fictional demonstration record, not an academic publication. No real authors, publication dates, measured statistics, quotations, or DOIs are claimed.', 10)
    label('RESEARCH OBJECTIVE'); para(objective)
    label('EVALUATION CONTEXT'); para(context)
    label('ILLUSTRATIVE CONNECTIONS')
    ids = re.findall(r"'([^']+)'", entities)
    para(' / '.join(entity_labels.get(k,k) for k in ids))
    label('HOW THIS DEMO WORKS')
    para('Upload this file with the other demo PDFs to Research Graph. The prototype recognizes the fixture filename and loads predefined structured metadata. It does not extract or analyze PDF text. Potential opportunities apply only to this fictional collection.')
    c.setStrokeColor(HexColor('#e0e6e9')); c.line(44, 70, 568, 70)
    c.setFont('Helvetica', 8); c.setFillColor(HexColor('#91a3af'))
    c.drawString(44, 51, 'RESEARCH GRAPH  /  AI-BASED SOFTWARE VULNERABILITY DETECTION'); c.drawRightString(568, 51, '1 / 1')
    c.save()
with zipfile.ZipFile(root/'public/demo-papers.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(out.glob('*.pdf')): archive.write(path, path.name)
manifest = [dict(id=f'sample-{i}',name=path.name,size=path.stat().st_size,lastModified=0) for i,path in enumerate(sorted(out.glob('*.pdf')),1)]
(root/'src/sample-files.ts').write_text("// Generated from bundled demo PDFs.\nimport type { UploadedFile } from './data'\nexport const sampleFiles: UploadedFile[] = " + json.dumps(manifest, indent=2) + '\n')
print(f'Generated {len(records)} fictional demo PDFs and archive.')
try:
    import fitz
    preview = Path('/tmp/research-graph-pdf-qa'); preview.mkdir(exist_ok=True)
    for path in sorted(out.glob('*.pdf')):
        doc = fitz.open(path)
        assert len(doc) == 1 and 'fictional' in doc[0].get_text().lower()
        doc[0].get_pixmap(matrix=fitz.Matrix(1,1)).save(preview/(path.stem+'.png'))
    print(f'Rendered all PDFs to {preview}')
except ImportError:
    print('Install pymupdf for rendering QA.')
