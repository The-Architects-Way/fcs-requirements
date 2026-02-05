const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const URL = 'https://miraloyd.github.io/fcs-requirements/';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots', 'final-e2e');
const PDF_PATH = path.join(__dirname, 'FCS-WEBFORM-E2E-FINAL_02-Feb-2026.pdf');
const OUTPUT_DIR = 'C:/Users/okose/Dropbox/_Architect rOS - Root/ENTERPRISES/MGCL_HUB/OPS/FCS/02-PROPOSAL/2026/January/27-Jan-26/PROPOSAL_CMS-WEBSITE-DESIGN-DEV_FCS-001/03-OUTPUT';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const TEST_DATA = {
  school_name: 'Faith Christian Schools, Karu',
  school_motto: 'Training a Child in the Way of the Lord',
  school_usp: 'We combine strong academics with Christian values, producing well-rounded graduates who excel in WAEC, NECO, and beyond. Our dedicated teachers and faith-centred environment nurture every child.',
  year_established: '2008',
  accreditations: 'FCT Education Board Approved',
  school_colours: 'Navy Blue and Gold',
  admission_process: 'Parents visit the school, collect a registration form, submit with required documents, and attend an entrance assessment.',
  school_address: 'Plot MF 31, ABG Hill, Behind Water Board, Karu',
  school_phone: '+234 XXX XXX XXXX',
  school_email: 'info@faithchristianschools.net',
  domain_details: 'faithchristianschools.net',
  primary_contact: 'Mrs. Lez, Proprietress',
  website_updater: 'School Admin Staff',
  whatsapp_number: '+234 XXX XXX XXXX'
};

const PAGE_TITLES = [
  '01 – School Identity',
  '02 – Branding & Visual Identity',
  '03 – Website Pages & Features',
  '04 – Admissions & Academics',
  '05 – Content, Images & Brand Assets',
  '06 – Social Media & Contact Info',
  '07 – Technical & Backend Access',
  '08 – Timeline & Final Details',
  '09 – Thank You (Submission Success)'
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });

  // Fill ALL fields across all pages at once
  await page.evaluate((data) => {
    function fill(name, val) {
      const el = document.querySelector('[name="'+name+'"]');
      if(el) { el.value = val; el.dispatchEvent(new Event('input',{bubbles:true})); }
    }
    function check(name, values) {
      document.querySelectorAll('input[type="checkbox"][name="'+name+'"]').forEach(b => {
        if(values.some(v => b.value.includes(v))) { b.checked = true; b.dispatchEvent(new Event('change',{bubbles:true})); }
      });
    }
    function radio(name, idx) {
      const r = document.querySelectorAll('input[type="radio"][name="'+name+'"]');
      if(r[idx]) { r[idx].checked = true; r[idx].dispatchEvent(new Event('change',{bubbles:true})); }
    }

    // Text fields
    Object.entries(data).forEach(([k,v]) => fill(k, v));

    // Checkboxes
    check('school_levels', ['Pre-Nursery', 'Primary', 'Junior Secondary']);
    check('curriculum', ['Nigerian']);
    check('pages_wanted', ['Home', 'About', 'Academics', 'Admissions', 'Gallery', 'Contact']);
    check('social_media', ['Facebook']);
    check('facilities', ['ICT', 'Library', 'Sports', 'Chapel']);

    // Radios (by index: 0=first option)
    radio('website_feel', 1); // Warm & Welcoming
    radio('whatsapp_button', 0); // Yes
    radio('contact_form', 0); // Yes
    radio('promo_video', 1); // No
    radio('fee_display', 1); // Ranges only
    radio('domain_access', 2); // Not sure
    radio('domain_status', 0); // We have it registered
    radio('content_source', 2); // Mix of both
    radio('timeline', 1); // Within 2 weeks

    // Consent checkboxes on page 8
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if(cb.name.includes('ndpa') || cb.name.includes('consent')) {
        cb.checked = true; cb.dispatchEvent(new Event('change',{bubbles:true}));
      }
    });
  }, TEST_DATA);

  // Navigate through pages and screenshot each
  for(let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));

    const filename = `page-${String(i+1).padStart(2,'0')}.png`;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: true });
    console.log(`Captured: ${filename} (Page ${i+1} of 8)`);

    if(i < 7) {
      // Click Continue
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue');
        if(btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 300));

      // Check if we advanced
      const pageNum = await page.evaluate(() => {
        const m = document.body.innerText.match(/Page (\d+) of (\d+)/);
        return m ? parseInt(m[1]) : 0;
      });

      if(pageNum === i+1) {
        // Didn't advance - try filling remaining required fields
        await page.evaluate(() => {
          document.querySelectorAll('[required]').forEach(f => {
            if(f.offsetParent !== null) {
              if(f.type === 'radio') {
                const grp = document.querySelectorAll('input[type="radio"][name="'+f.name+'"]');
                if(!Array.from(grp).some(r => r.checked) && grp[0]) {
                  grp[0].checked = true; grp[0].dispatchEvent(new Event('change',{bubbles:true}));
                }
              } else if(f.type === 'checkbox') {
                if(!f.checked) { f.checked = true; f.dispatchEvent(new Event('change',{bubbles:true})); }
              } else if(!f.value || !f.value.trim()) {
                f.value = 'E2E Test'; f.dispatchEvent(new Event('input',{bubbles:true}));
              }
            }
          });
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue');
          if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }

  // Intercept fetch to prevent actual submission, then click Submit
  await page.evaluate(() => {
    window._originalFetch = window.fetch;
    window.fetch = function(url, opts) {
      if(url && url.toString().includes('web3forms')) {
        // Fake successful response
        return Promise.resolve(new Response(JSON.stringify({success:true,message:'OK'}), {status:200, headers:{'Content-Type':'application/json'}}));
      }
      return window._originalFetch(url, opts);
    };
    // Check consent boxes if not checked
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if(cb.offsetParent !== null && !cb.checked) { cb.checked = true; cb.dispatchEvent(new Event('change',{bubbles:true})); }
    });
    // Fill primary_contact if empty
    document.querySelectorAll('[required]').forEach(f => {
      if(f.offsetParent !== null && !f.value && f.type !== 'radio' && f.type !== 'checkbox') {
        f.value = 'E2E Test'; f.dispatchEvent(new Event('input',{bubbles:true}));
      }
    });
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit');
    if(btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'page-09.png'), fullPage: true });
  console.log('Captured: page-09.png (Thank You page)');

  // Generate PDF –one screenshot per landscape page
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 30 });
  const stream = fs.createWriteStream(PDF_PATH);
  doc.pipe(stream);

  const screenshots = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png')).sort();

  for(let i = 0; i < screenshots.length; i++) {
    if(i > 0) doc.addPage({ layout: 'landscape', size: 'A4', margin: 30 });

    const imgPath = path.join(SCREENSHOT_DIR, screenshots[i]);

    // Header
    doc.rect(0, 0, doc.page.width, 50).fill('#1a3a5c');
    doc.fontSize(14).fillColor('#ffffff').text('FCS Website Requirements Questionnaire –E2E Test Report', 30, 15, { width: doc.page.width - 200 });
    doc.fontSize(10).text(PAGE_TITLES[i] || `Page ${i+1}`, doc.page.width - 200, 18, { width: 170, align: 'right' });

    // Image
    const imgWidth = doc.page.width - 60;
    const imgHeight = doc.page.height - 100;
    doc.image(imgPath, 30, 60, { fit: [imgWidth, imgHeight], align: 'center', valign: 'center' });

    // Footer
    doc.fontSize(8).fillColor('#666666').text('Miraloyd Global Consult Ltd –www.miraloyd.com', 30, doc.page.height - 25, { width: doc.page.width - 60, align: 'center' });
  }

  doc.end();
  await new Promise(r => stream.on('finish', r));
  console.log(`PDF generated: ${PDF_PATH}`);

  // Copy to L2
  fs.copyFileSync(PDF_PATH, path.join(OUTPUT_DIR, 'FCS-WEBFORM-E2E-FINAL_02-Feb-2026.pdf'));
  console.log('Copied to L2 03-OUTPUT');

  await browser.close();
  console.log('Done!');
})().catch(err => { console.error(err); process.exit(1); });
