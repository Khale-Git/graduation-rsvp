# Graduation Celebration RSVP Website & Management Portal
**Graduate:** Ian Kiromo Githengu  
**Degree:** Bachelor's Degree in Applied Computer Science  
**Institution:** Daystar University  
**Event Date:** Saturday, November 21st, 2026 at 2:00 PM EAT  
**Venue:** Thee Bobians Residence (-1.1562, 36.6424)

---

## What's Included

### 1. Backend Data Collection
- **Self-Hosted Backend (server.py):** Standalone zero-dependency Python server that serves front-end assets, ingests RSVPs into svps.json, computes live catering headcounts, and serves CSV exports.
- **Cloud Ingestion Ready (GOOGLE_SHEETS_SETUP.md):** Instructions to pipe submissions directly into Google Sheets or Formspree if hosted statically on Vercel/Netlify/GitHub Pages.

### 2. Add to Calendar Integrations
- **Google Calendar (1-Click):** Pre-filled with event title, graduate bio, location, Daystar University degree, and map link.
- **Apple Calendar / Outlook (.ics):** Direct file generation with start/end time (Nov 21, 2026, 2:00 PM - 7:00 PM EAT), alarm triggers, and geo-coordinates (GEO:-1.1562;36.6424).

### 3. Hidden Admin Portal & Catering Budgeting
- **Access:** Click the Admin button in the header, click the lock icon in the footer, click the top-left terminal symbol (>_ IKG.GRAD // 2026), or press Ctrl + Shift + A.
- **Passcode:** 2026 (configurable in server.py & pp.js).
- **Features:**
  - **Headcount Calculation:** Sums up total confirmed guests (+1s included) for accurate catering & chair budgeting.
  - **Live Table:** Search and filter by name or phone number.
  - **1-Click CSV Export:** Downloads ian_kiromo_graduation_rsvps.csv ready for Excel/Google Sheets.

### 4. Portfolio Footer (Designed by the Graduate)
- Showcases Ian Kiromo Githengu as the designer and engineer.
- Includes professional links: GitHub, LinkedIn, Portfolio Website, and Email.

---

## How to Run

Launch the backend server:
`powershell
python server.py
`
Open **http://localhost:8088/** in your browser.
