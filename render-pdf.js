const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Usage: node render-pdf.js [html-file] [output-pdf]
const htmlFile = process.argv[2] || 'filled-example-slides.html';
const outputPdf = process.argv[3] || 'FCS-WEBFORM-FILLED-EXAMPLE.pdf';

(async () => {
    const htmlDir = __dirname;
    const MIME = { '.html':'text/html', '.css':'text/css', '.ttf':'font/ttf', '.woff2':'font/woff2' };
    const server = http.createServer((req, res) => {
        let fp = path.join(htmlDir, req.url === '/' ? htmlFile : decodeURIComponent(req.url));
        let ct = MIME[path.extname(fp)] || 'application/octet-stream';
        fs.readFile(fp, (err, data) => {
            if (err) { res.writeHead(404); res.end(); return; }
            res.writeHead(200, { 'Content-Type': ct });
            res.end(data);
        });
    });

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb']
    });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    await page.pdf({
        path: path.join(__dirname, outputPdf),
        width: '13.333in',
        height: '7.5in',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();
    server.close();

    const stats = fs.statSync(path.join(__dirname, outputPdf));
    console.log(`${outputPdf}: ${(stats.size/1024).toFixed(0)} KB`);
})();
