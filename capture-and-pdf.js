const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const url = 'https://the-architects-way.github.io/fcs-requirements/';
    const ssDir = path.join(__dirname, 'test-screenshots');

    console.log('Loading form...');
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Clear any saved progress
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Page 1
    console.log('Capturing Page 1 - Your School...');
    await page.screenshot({ path: path.join(ssDir, '01-page1-your-school.png'), fullPage: false });

    // Fill Page 1 required fields
    await page.click('#lv3'); // Primary
    await page.type('textarea[name="school_usp"]', 'TEST: Strong academics with Christian values and a nurturing environment.');

    // Navigate to Page 2
    await page.evaluate(() => navigate(1));
    await new Promise(r => setTimeout(r, 500));

    // Page 2
    console.log('Capturing Page 2 - Branding...');
    await page.screenshot({ path: path.join(ssDir, '02-page2-branding.png'), fullPage: false });

    await page.type('input[name="school_colours"]', 'Navy blue and gold');
    await page.type('input[name="school_motto"]', 'Knowledge, Faith, Excellence');
    await page.click('#feel2'); // Warm & Welcoming

    await page.evaluate(() => navigate(1));
    await new Promise(r => setTimeout(r, 500));

    // Page 3
    console.log('Capturing Page 3 - Features...');
    await page.screenshot({ path: path.join(ssDir, '03-page3-features.png'), fullPage: false });

    // Check some pages
    await page.evaluate(() => {
        document.querySelector('#pg2').click(); // About Us
        document.querySelector('#pg4').click(); // Admissions
        document.querySelector('#pg10').click(); // Contact Us
    });
    // WhatsApp Yes
    await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="whatsapp_button"]');
        if(radios[0]) radios[0].click();
    });
    // Contact form Yes
    await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="contact_form"]');
        if(radios[0]) radios[0].click();
    });
    // Social: None yet
    await page.evaluate(() => {
        const cb = document.querySelector('#sm5');
        if(cb) cb.click();
    });
    // Promo video: No
    await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="promo_video"]');
        if(radios[1]) radios[1].click();
    });

    await page.evaluate(() => navigate(1));
    await new Promise(r => setTimeout(r, 500));

    // Page 4
    console.log('Capturing Page 4 - Admissions...');
    await page.screenshot({ path: path.join(ssDir, '04-page4-admissions.png'), fullPage: false });

    await page.type('textarea[name="admission_process"]', 'TEST: 1. Visit 2. Fill form 3. Entrance exam 4. Pay fees');
    // Fee: No - contact school
    await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="fee_display"]');
        if(radios[2]) radios[2].click();
    });
    // Facilities
    await page.evaluate(() => {
        const cb = document.querySelector('#fac3');
        if(cb) cb.click(); // Library
    });

    await page.evaluate(() => navigate(1));
    await new Promise(r => setTimeout(r, 500));

    // Page 5
    console.log('Capturing Page 5 - Contact...');
    await page.screenshot({ path: path.join(ssDir, '05-page5-contact.png'), fullPage: false });

    await page.evaluate(() => {
        document.querySelector('input[name="school_phone"]').value = '+234 803 601 2387';
        document.querySelector('input[name="school_email"]').value = 'test@faithchristianschools.net';
    });
    // Domain: Not sure
    await page.evaluate(() => {
        const radios = document.querySelectorAll('input[name="domain_access"]');
        if(radios[2]) radios[2].click();
    });

    await page.evaluate(() => navigate(1));
    await new Promise(r => setTimeout(r, 500));

    // Page 6
    console.log('Capturing Page 6 - Content & Launch...');
    await page.screenshot({ path: path.join(ssDir, '06-page6-content-launch.png'), fullPage: false });

    // Scroll to show footer/submit
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 300));
    console.log('Capturing Page 6 footer with Submit...');
    await page.screenshot({ path: path.join(ssDir, '07-page6-submit-area.png'), fullPage: false });

    console.log('All page screenshots captured!');
    console.log('Screenshots saved to:', ssDir);

    await browser.close();
})();
