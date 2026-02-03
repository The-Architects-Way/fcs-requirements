"""
FCS Website Requirements Questionnaire - End-to-End Test Report
Miraloyd Corporate Identity: Red #9d1c20 | Light Grey #888687 | White
PowerPoint-style PDF for Internal Correspondence
"""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
import os

# === MIRALOYD CORPORATE PALETTE ===
MIRA_RED = HexColor('#9d1c20')        # Primary — deep crimson
MIRA_RED_LIGHT = HexColor('#c94948')   # Accent red — lighter
MIRA_GREY = HexColor('#888687')        # Corporate light grey
MIRA_GREY_LIGHT = HexColor('#d4d3d3')  # Subtle grey (borders, dividers)
MIRA_GREY_BG = HexColor('#f5f5f5')     # Near-white grey (slide backgrounds)
WHITE = white
BLACK = black
TEXT_DARK = HexColor('#2d2d2d')         # Rich black for body text
TEXT_MID = HexColor('#555555')          # Mid-grey for secondary text

# === CONFIG ===
OUTPUT_PDF = r"C:\Users\okose\Desktop\fcs-requirements\FCS-WEBFORM-TEST-REPORT_31-Jan-2026.pdf"
SS_DIR = r"C:\Users\okose\Desktop\fcs-requirements\test-screenshots"
LOGO = r"C:\Users\okose\Desktop\fcs-requirements\logo-mgcl.jpg"
PAGE_W, PAGE_H = landscape(A4)


def draw_header_bar(c, text, subtitle=None):
    """Miraloyd Red header bar with white text"""
    # Red bar
    c.setFillColor(MIRA_RED)
    c.rect(0, PAGE_H - 60, PAGE_W, 60, fill=1, stroke=0)
    # Thin grey accent line below
    c.setStrokeColor(MIRA_GREY_LIGHT)
    c.setLineWidth(1.5)
    c.line(0, PAGE_H - 60, PAGE_W, PAGE_H - 60)
    # Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(30, PAGE_H - 40, text)
    if subtitle:
        c.setFillColor(MIRA_GREY_LIGHT)
        c.setFont("Helvetica", 11)
        c.drawString(30, PAGE_H - 55, subtitle)


def draw_footer(c, page_num, total_pages):
    """Clean white footer with Miraloyd branding"""
    # White footer bar
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, 28, fill=1, stroke=0)
    # Red accent line above footer
    c.setStrokeColor(MIRA_RED)
    c.setLineWidth(2)
    c.line(0, 28, PAGE_W, 28)
    # Footer text
    c.setFillColor(MIRA_GREY)
    c.setFont("Helvetica", 7.5)
    c.drawString(30, 10, "Miraloyd Global Consult Ltd  |  Internal Correspondence  |  CONFIDENTIAL")
    c.drawRightString(PAGE_W - 30, 10, f"Page {page_num} of {total_pages}")


def draw_title_slide(c):
    """Slide 1: Clean white title slide with Miraloyd Red accents"""
    # White background
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top red band (thin)
    c.setFillColor(MIRA_RED)
    c.rect(0, PAGE_H - 8, PAGE_W, 8, fill=1, stroke=0)

    # Logo — centered
    if os.path.exists(LOGO):
        c.drawImage(ImageReader(LOGO), PAGE_W/2 - 110, PAGE_H*0.62,
                     width=220, height=88, preserveAspectRatio=True, mask='auto')

    # Red divider line
    c.setStrokeColor(MIRA_RED)
    c.setLineWidth(3)
    c.line(PAGE_W*0.2, PAGE_H*0.56, PAGE_W*0.8, PAGE_H*0.56)

    # Title — Miraloyd Red
    c.setFillColor(MIRA_RED)
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.44, "FCS Website Requirements")
    c.drawCentredString(PAGE_W/2, PAGE_H*0.37, "Questionnaire Form")

    # Subtitle — Grey
    c.setFillColor(MIRA_GREY)
    c.setFont("Helvetica", 16)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.27, "End-to-End Test Report")

    # Date & classification
    c.setFillColor(MIRA_GREY_LIGHT)
    c.setFont("Helvetica", 11)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.18, "31 January 2026  |  Internal Correspondence")

    c.setFillColor(MIRA_GREY)
    c.setFont("Helvetica", 10)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.13, "Prepared by: Miraloyd Global Consult Ltd")

    # Bottom red band (thin)
    c.setFillColor(MIRA_RED)
    c.rect(0, 28, PAGE_W, 3, fill=1, stroke=0)

    draw_footer(c, 1, 10)


def draw_summary_slide(c):
    """Slide 2: Test Summary — white background, red accents"""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_header_bar(c, "Test Summary", "Form Deployment Verification — All Systems Green")

    y = PAGE_H - 105

    items = [
        ("Live URL", "https://is.gd/miraloyd_fcs", MIRA_RED),
        ("Hosting", "GitHub Pages (the-architects-way.github.io)", TEXT_DARK),
        ("Form Backend", "Web3Forms (API key: 5730ddd0...)", TEXT_DARK),
        ("Email Delivery", "okosej@miraloyd.com — CONFIRMED", MIRA_RED),
        ("Pages", "6 pages + Thank You confirmation", TEXT_DARK),
        ("Questions", "25 questions with conditional logic", TEXT_DARK),
        ("File Uploads", "Logo + documents (5MB/file limit)", TEXT_DARK),
        ("Auto-Save", "localStorage persistence — WORKING", MIRA_RED),
        ("Mobile Responsive", "Verified", MIRA_RED),
        ("Branding", "MGCL logo header + footer — Miraloyd ONLY", MIRA_RED),
    ]

    for i, (label, value, color) in enumerate(items):
        # Alternating subtle grey background rows for spatial clarity
        if i % 2 == 0:
            c.setFillColor(MIRA_GREY_BG)
            c.rect(40, y - 6, PAGE_W - 80, 22, fill=1, stroke=0)

        # Label — grey
        c.setFillColor(MIRA_GREY)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(55, y, f"{label}:")

        # Value — colored
        c.setFillColor(color)
        c.setFont("Helvetica", 11)
        c.drawString(210, y, value)
        y -= 24

    # Verdict box — Miraloyd Red
    y -= 15
    c.setFillColor(MIRA_RED)
    c.roundRect(50, y - 8, PAGE_W - 100, 38, 6, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(PAGE_W/2, y + 2, "VERDICT: ALL TESTS PASSED")

    draw_footer(c, 2, 10)


def draw_screenshot_slide(c, img_path, title, slide_num, total, caption=None):
    """Screenshot slide — white bg, red header, grey shadow"""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_header_bar(c, title)

    if os.path.exists(img_path):
        img = Image.open(img_path)
        img_w, img_h = img.size

        avail_w = PAGE_W - 100
        avail_h = PAGE_H - 135

        scale = min(avail_w / img_w, avail_h / img_h)
        draw_w = img_w * scale
        draw_h = img_h * scale

        x = (PAGE_W - draw_w) / 2
        y = 38 + (avail_h - draw_h) / 2

        # Grey shadow (Miraloyd Grey)
        c.setFillColor(MIRA_GREY_LIGHT)
        c.roundRect(x + 4, y - 4, draw_w, draw_h, 3, fill=1, stroke=0)

        # Screenshot image
        c.drawImage(ImageReader(img_path), x, y, width=draw_w, height=draw_h)

        # Thin border
        c.setStrokeColor(MIRA_GREY_LIGHT)
        c.setLineWidth(0.8)
        c.roundRect(x, y, draw_w, draw_h, 3, fill=0, stroke=1)

    if caption:
        c.setFillColor(MIRA_GREY)
        c.setFont("Helvetica-Oblique", 8.5)
        c.drawCentredString(PAGE_W/2, 33, caption)

    draw_footer(c, slide_num, total)


def draw_closing_slide(c):
    """Slide 10: Closing — white with red accents"""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top red band
    c.setFillColor(MIRA_RED)
    c.rect(0, PAGE_H - 8, PAGE_W, 8, fill=1, stroke=0)

    # Logo
    if os.path.exists(LOGO):
        c.drawImage(ImageReader(LOGO), PAGE_W/2 - 110, PAGE_H*0.62,
                     width=220, height=88, preserveAspectRatio=True, mask='auto')

    # Red divider
    c.setStrokeColor(MIRA_RED)
    c.setLineWidth(3)
    c.line(PAGE_W*0.2, PAGE_H*0.56, PAGE_W*0.8, PAGE_H*0.56)

    # DEPLOYMENT COMPLETE — Red
    c.setFillColor(MIRA_RED)
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.43, "DEPLOYMENT COMPLETE")

    # Status line — Grey
    c.setFillColor(MIRA_GREY)
    c.setFont("Helvetica", 14)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.34, "Form is Live  |  Email Delivery Confirmed  |  Ready for Client")

    # Live link — lighter red
    c.setFillColor(MIRA_RED_LIGHT)
    c.setFont("Helvetica", 12)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.24, "Live Link: https://is.gd/miraloyd_fcs")

    # Tagline
    c.setFillColor(MIRA_GREY_LIGHT)
    c.setFont("Helvetica", 10)
    c.drawCentredString(PAGE_W/2, PAGE_H*0.17, "Miraloyd Global Consult Ltd  |  Enabling Technology, Supporting People")

    # Bottom red band
    c.setFillColor(MIRA_RED)
    c.rect(0, 28, PAGE_W, 3, fill=1, stroke=0)

    draw_footer(c, 10, 10)


# === BUILD PDF ===
print("Generating Miraloyd Corporate PDF...")
c = canvas.Canvas(OUTPUT_PDF, pagesize=landscape(A4))
total_slides = 10

# Slide 1: Title
draw_title_slide(c)
c.showPage()

# Slide 2: Summary
draw_summary_slide(c)
c.showPage()

# Slides 3-9: Screenshots
screenshots = [
    ("01-page1-your-school.png", "Page 1 of 6 — Your School",
     "School identity, levels offered, unique selling proposition"),
    ("02-page2-branding.png", "Page 2 of 6 — Branding & Look",
     "Logo upload, colours, motto, website feel preference"),
    ("03-page3-features.png", "Page 3 of 6 — Website Pages & Features",
     "Page selection, WhatsApp button, contact form, social media"),
    ("04-page4-admissions.png", "Page 4 of 6 — Admissions & Academics",
     "Admission process, fee display, facilities, achievements"),
    ("05-page5-contact.png", "Page 5 of 6 — Contact & Access",
     "Address, phone, email, domain access verification"),
    ("06-page6-content-launch.png", "Page 6 of 6 — Content & Launch",
     "Website updater, content provision, timeline, file uploads"),
    ("07-page6-submit-area.png", "Submit Area & Footer",
     "Submit button, auto-save badge, Miraloyd Global Consult Ltd branding"),
]

for i, (filename, title, caption) in enumerate(screenshots):
    img_path = os.path.join(SS_DIR, filename)
    draw_screenshot_slide(c, img_path, title, i + 3, total_slides, caption)
    c.showPage()

# Slide 10: Closing
draw_closing_slide(c)
c.showPage()

c.save()
print(f"PDF: {OUTPUT_PDF}")
print(f"Palette: Miraloyd Red #9d1c20 | Grey #888687 | White")
print(f"Slides: {total_slides}")
