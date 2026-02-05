/**
 * FCS Webform – Sample Guide PDF Generator v2.0
 * PowerPoint-style: viewport-cropped slides for legibility.
 * Each form page is captured in scrolled viewport chunks (not full-page).
 * Result: HD, legible, branded landscape A4 slides.
 *
 * Session: CC-rOS-20260131-002
 * Instance: Shikamaru
 * Timestamp: 2026-02-02
 * SOP: SOP-WEBFORM-E2E-TEST v1.0 (∞⟨SRR⟩∞)
 */

const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const FORM_URL = 'https://miraloyd.github.io/fcs-requirements/';
const OUTPUT_DIR = path.join(__dirname, 'sample-guide-screenshots');
const PDF_PATH = path.join(__dirname, 'FCS-WEBFORM-SAMPLE-GUIDE.pdf');

// Viewport: wide enough to show form clearly, not too tall so each chunk is readable
const VP_WIDTH = 1440;
const VP_HEIGHT = 900;
const DEVICE_SCALE = 2; // Retina for HD quality

const SAMPLE_DATA = {
    school_name: 'Harmony Academy International',
    school_motto: 'Knowledge, Faith, Excellence',
    year_established: '2005',
    school_usp: 'A leading co-educational school offering a blended Nigerian and British curriculum, with a strong emphasis on character development, STEM education, and extracurricular enrichment. Our students consistently achieve top results in WAEC, NECO, and Cambridge IGCSE examinations.',
    accreditations: 'Approved by FCT Education Board. WAEC/NECO Centre. Cambridge International School. Member, Association of Private Educators in Nigeria (APEN).',
    school_colours: 'Royal Blue (#003366), Gold (#D4AF37), White (#FFFFFF)',
    admission_process: 'Parents can apply online or visit the school. Admission process includes: (1) Completion of application form, (2) Entrance assessment in English and Mathematics, (3) Interview with the Head of School, (4) Payment of acceptance fee upon offer. Applications open from September to January each year.',
    school_address: '25 Unity Close, Maitama District, Abuja, FCT, Nigeria',
    school_phone: '+234 809 123 4567\n+234 703 987 6543',
    school_email: 'info@harmonyacademy.ng',
    facebook_url: 'https://facebook.com/harmonyacademyng',
    instagram_url: 'https://instagram.com/harmonyacademy_ng',
    domain_name: 'harmonyacademy.ng',
    primary_contact: 'Mrs. Ngozi Obi, Proprietress',
    additional_notes: 'We would like the website to reflect our school values and provide an easy way for parents to access information. Mobile-friendly design is very important as most of our parents use smartphones.'
};

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: VP_WIDTH, height: VP_HEIGHT, deviceScaleFactor: DEVICE_SCALE }
    });

    const page = await browser.newPage();
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Clear old screenshots
    fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png')).forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));

    console.log('Navigating to form...');
    await page.goto(FORM_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.goto(FORM_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('Filling all fields...');
    await page.evaluate((data) => {
        function fill(n,v){const e=document.querySelector(`[name="${n}"]`);if(e){e.value=v;e.dispatchEvent(new Event('input',{bubbles:1}));e.dispatchEvent(new Event('change',{bubbles:1}));}}
        function fillTa(n,v){const e=document.querySelector(`textarea[name="${n}"]`);if(e){e.value=v;e.dispatchEvent(new Event('input',{bubbles:1}));}}
        function radioIdx(n,i){const e=document.querySelectorAll(`[name="${n}"]`);if(e[i]){e[i].checked=1;e[i].dispatchEvent(new Event('change',{bubbles:1}));}}
        function chkId(id){const e=document.getElementById(id);if(e){e.checked=1;e.dispatchEvent(new Event('change',{bubbles:1}));}}

        // P1
        fill('school_name', data.school_name);
        chkId('lv0'); chkId('lv1'); chkId('lv2'); chkId('lv3'); chkId('lv4');
        fill('school_motto', data.school_motto);
        fill('year_established', data.year_established);
        fillTa('school_usp', data.school_usp);
        const curr = document.querySelectorAll('[name="curriculum"]');
        if(curr[0]) curr[0].checked = true;
        if(curr[2]) curr[2].checked = true;
        if(curr[3]) curr[3].checked = true;
        fillTa('accreditations', data.accreditations);

        // P2
        fill('school_colours', data.school_colours);
        radioIdx('website_feel', 0);

        // P3
        ['pg0','pg1','pg2','pg3','pg4','pg5','pg6','pg7','pg10','pg11','pg12','pg13'].forEach(id => chkId(id));
        ['ft0','ft1','ft2','ft3','ft4','ft5','ft6'].forEach(id => chkId(id));

        // P4
        fillTa('admission_process', data.admission_process);
        radioIdx('fee_display', 2);
        const facs = document.querySelectorAll('[name="facilities"]');
        [0,1,2,3,4].forEach(i => { if(facs[i]) facs[i].checked = true; });

        // P5
        radioIdx('promo_video', 1);
        radioIdx('content_source', 1);

        // P6
        fillTa('school_address', data.school_address);
        fillTa('school_phone', data.school_phone);
        fill('school_email', data.school_email);
        const smFb = document.getElementById('sm1');
        const smIg = document.getElementById('sm2');
        if(smFb) { smFb.checked = true; if(typeof toggleSocialURL==='function') toggleSocialURL('sm1','fbUrl'); }
        if(smIg) { smIg.checked = true; if(typeof toggleSocialURL==='function') toggleSocialURL('sm2','igUrl'); }
        fill('facebook_url', data.facebook_url);
        fill('instagram_url', data.instagram_url);

        // P7
        radioIdx('domain_status', 0);
        fill('domain_name', data.domain_name);
        radioIdx('hosting_status', 1);
        radioIdx('email_setup', 2);
        radioIdx('credentials_method', 0);

        // P8
        radioIdx('timeline', 1);
        fill('primary_contact', data.primary_contact);
        radioIdx('website_updater', 1); // MGCL to manage
        fillTa('additional_notes', data.additional_notes);
    }, SAMPLE_DATA);

    await new Promise(r => setTimeout(r, 500));

    // Re-verify social media
    await page.evaluate((data) => {
        function fill(n,v){const e=document.querySelector(`[name="${n}"]`);if(e){e.value=v;e.dispatchEvent(new Event('input',{bubbles:1}));}}
        const smFb = document.getElementById('sm1');
        const smIg = document.getElementById('sm2');
        if(smFb && !smFb.checked) { smFb.checked = true; if(typeof toggleSocialURL==='function') toggleSocialURL('sm1','fbUrl'); }
        if(smIg && !smIg.checked) { smIg.checked = true; if(typeof toggleSocialURL==='function') toggleSocialURL('sm2','igUrl'); }
        fill('facebook_url', data.facebook_url);
        fill('instagram_url', data.instagram_url);
    }, SAMPLE_DATA);

    const pageNames = [
        'School Identity',
        'Branding & Visual Identity',
        'Website Pages & Features',
        'Admissions & Academics',
        'Content, Images & Brand Assets',
        'Social Media & Contact Info',
        'Technical & Backend Access',
        'Timeline & Final Details'
    ];

    let slideIndex = 0;
    const slides = []; // {file, title, subtitle}

    // For each form page: scroll through in viewport-height chunks and capture each
    for (let formPage = 0; formPage < 8; formPage++) {
        console.log(`Processing Page ${formPage + 1}: ${pageNames[formPage]}`);

        // Get total scroll height of the active page content
        const pageInfo = await page.evaluate(() => {
            const body = document.documentElement;
            return {
                scrollHeight: body.scrollHeight,
                viewportHeight: window.innerHeight
            };
        });

        // Scroll to top first
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 300));

        const totalHeight = pageInfo.scrollHeight;
        const vpH = pageInfo.viewportHeight;
        // Overlap each chunk by 80px so nothing is cut mid-element
        const step = vpH - 80;
        let scrollY = 0;
        let chunkIdx = 0;

        while (scrollY < totalHeight) {
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);
            await new Promise(r => setTimeout(r, 200));

            slideIndex++;
            const filename = `slide-${String(slideIndex).padStart(3, '0')}.png`;
            const filepath = path.join(OUTPUT_DIR, filename);

            // Viewport screenshot (not full page) – this gives us the exact visible area
            await page.screenshot({ path: filepath, fullPage: false });

            slides.push({
                file: filepath,
                title: `${String(formPage + 1).padStart(2, '0')} – ${pageNames[formPage]}`,
                subtitle: chunkIdx === 0 ? '' : '(continued)'
            });

            console.log(`  Slide ${slideIndex}: chunk ${chunkIdx + 1} (scrollY=${scrollY})`);
            chunkIdx++;
            scrollY += step;

            // Don't exceed total height
            if (scrollY >= totalHeight - 100) break;
        }

        // Navigate to next page
        if (formPage < 7) {
            const advanced = await page.evaluate(() => {
                const btns = document.querySelectorAll('button');
                const cont = Array.from(btns).find(b => b.textContent.trim() === 'Continue' && b.offsetParent !== null);
                if (cont) { cont.click(); return true; }
                return false;
            });

            if (!advanced) {
                // Fix missing required fields and retry
                await page.evaluate(() => {
                    const active = document.querySelector('.page.active');
                    if (!active) return;
                    active.querySelectorAll('[required]').forEach(el => {
                        if (el.type === 'radio') {
                            const name = el.name;
                            if (!document.querySelector(`[name="${name}"]:checked`)) {
                                const first = document.querySelector(`[name="${name}"]`);
                                if (first) { first.checked = true; first.dispatchEvent(new Event('change',{bubbles:true})); }
                            }
                        } else if (!el.value) {
                            el.value = 'Sample response';
                            el.dispatchEvent(new Event('input',{bubbles:true}));
                        }
                    });
                    const cont = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue' && b.offsetParent !== null);
                    if (cont) cont.click();
                });
            }
            await new Promise(r => setTimeout(r, 500));
        }
    }

    await browser.close();
    console.log(`\n${slides.length} slides captured. Generating PDF...`);

    // ====== GENERATE LANDSCAPE A4 PDF ======
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    const stream = fs.createWriteStream(PDF_PATH);
    doc.pipe(stream);

    const PW = doc.page.width;   // 841.89
    const PH = doc.page.height;  // 595.28

    // ---- TITLE PAGE ----
    doc.rect(0, 0, PW, PH).fill('#1a3a5c');

    // MGCL logo placeholder – gold accent bar
    doc.rect(PW/2 - 100, 100, 200, 4).fill('#c8a84e');

    doc.fontSize(32).fillColor('#ffffff').text('FCS Website Requirements', 0, 150, { align: 'center', width: PW });
    doc.fontSize(32).fillColor('#c8a84e').text('Questionnaire', 0, 190, { align: 'center', width: PW });

    doc.rect(PW/2 - 60, 245, 120, 2).fill('#c8a84e');

    doc.fontSize(18).fillColor('#ffffff').text('Sample Guide', 0, 270, { align: 'center', width: PW });
    doc.moveDown(1.5);
    doc.fontSize(12).fillColor('#aabbcc').text('This document shows a completed example of the questionnaire.', 0, 320, { align: 'center', width: PW });
    doc.fontSize(12).fillColor('#aabbcc').text('Use it as a reference when filling in your own responses.', 0, 340, { align: 'center', width: PW });

    doc.moveDown(4);
    doc.fontSize(10).fillColor('#667788').text('Miraloyd Global Consult Ltd', 0, 460, { align: 'center', width: PW });
    doc.text('www.miraloyd.com', 0, 475, { align: 'center', width: PW });

    // Bottom accent bar
    doc.rect(0, PH - 6, PW, 6).fill('#c8a84e');

    // ---- CONTENT SLIDES ----
    const HEADER_H = 40;
    const FOOTER_H = 18;
    const IMG_TOP = HEADER_H + 4;
    const IMG_BOTTOM = PH - FOOTER_H;
    const IMG_HEIGHT = IMG_BOTTOM - IMG_TOP;
    const IMG_MARGIN = 12;
    const IMG_WIDTH = PW - (IMG_MARGIN * 2);

    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        doc.addPage({ layout: 'landscape', size: 'A4', margin: 0 });

        // Header bar
        doc.rect(0, 0, PW, HEADER_H).fill('#1a3a5c');
        doc.fontSize(11).fillColor('#ffffff').text(
            `Sample Guide – ${slide.title} ${slide.subtitle}`,
            16, 12
        );
        doc.fontSize(9).fillColor('#c8a84e').text(
            `Slide ${i + 1} of ${slides.length}`,
            PW - 120, 14
        );

        // Screenshot image – fills the entire content area
        if (fs.existsSync(slide.file)) {
            doc.image(slide.file, IMG_MARGIN, IMG_TOP, {
                fit: [IMG_WIDTH, IMG_HEIGHT],
                align: 'center',
                valign: 'center'
            });
        }

        // Footer bar
        doc.rect(0, PH - FOOTER_H, PW, FOOTER_H).fill('#f0f0f0');
        doc.fontSize(7).fillColor('#888888').text(
            'Sample Guide – Miraloyd Global Consult Ltd | www.miraloyd.com',
            0, PH - 13,
            { align: 'center', width: PW }
        );
    }

    doc.end();
    await new Promise(resolve => stream.on('finish', resolve));

    const stats = fs.statSync(PDF_PATH);
    console.log(`\nPDF generated: ${PDF_PATH}`);
    console.log(`Total slides: ${slides.length + 1} (1 title + ${slides.length} content)`);
    console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log('Done.');
}

run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
