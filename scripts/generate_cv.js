const fs = require('fs');
const { Document, Packer, Paragraph, HeadingLevel } = require('docx');
const puppeteer = require('puppeteer');

const EN = 'en', AR = 'ar';
const OUT = 'assets/downloads';

async function makeDocx(lang) {
  const title = 'Mohamad Adib Tawil';
  const job = lang===AR ? 'مطوّر Flutter متوسط المستوى' : 'Mid-level Flutter Developer';
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children: [
        new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: job }),
        new Paragraph({ text: 'See website for full details.' }),
      ]
    }]
  });
  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/CV_${lang.toUpperCase()}.docx`, buf);
}

async function makePdf(lang) {
  const url = `file://${process.cwd()}/index.html`;
  const browser = await puppeteer.launch({ headless: 'new', args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate((l)=>{ localStorage.setItem('lang', l); }, lang);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.pdf({
    path: `${OUT}/CV_${lang.toUpperCase()}.pdf`,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });
  await browser.close();
}

(async ()=>{
  await makeDocx(EN); await makeDocx(AR);
  await makePdf(EN); await makePdf(AR);
  console.log('Generated: assets/downloads/CV_EN/AR.{docx,pdf}');
})();
