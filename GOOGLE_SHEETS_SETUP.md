# Cloud Backend Setup Guide (Google Sheets & Formspree)

If you host this website on a static cloud provider (such as GitHub Pages, Netlify, or Vercel), you can easily pipe all RSVPs directly into a **Google Sheet** or **Formspree** with zero cost.

---

## Option A: Free Google Sheets Ingestion (Recommended)

1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet named **"Ian Kiromo Graduation RSVPs"**.
2. Add these column headers in Row 1:
   - Column A: `Timestamp`
   - Column B: `Reference Code`
   - Column C: `Full Name`
   - Column D: `Phone Number`
   - Column E: `Attending`
   - Column F: `Guest Count`
   - Column G: `Dietary Requirements`
   - Column H: `Tea & Beverage Urn`
   - Column I: `Message`
3. Click **Extensions > Apps Script** from the top menu.
4. Replace all code in the script editor with the snippet below:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rawData = e.postData.contents;
  var data = JSON.parse(rawData);
  
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.referenceCode || '',
    data.fullName || '',
    data.phoneNumber || '',
    data.attending || '',
    data.guestCount || '1',
    data.dietary || 'Standard Menu',
    data.teaPreference || 'Chai (Tea with Sugar)',
    data.message || ''
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'RSVP recorded in Google Sheet'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

5. Click **Deploy > New Deployment**:
   - Select Type: **Web app**
   - Description: `Graduation RSVP Ingestion API`
   - Execute as: **Me**
   - Who has access: **Anyone** *(Crucial for public web form submissions)*
6. Click **Deploy** and copy the **Web App URL** (e.g., `https://script.google.com/macros/s/AKfyc.../exec`).
7. Open `app.js` and set:
   ```javascript
   CONFIG.REMOTE_WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```

---

## Option B: Formspree (Instant Setup)

1. Create a free account at [Formspree.io](https://formspree.io).
2. Create a new form (e.g., "Graduation RSVP").
3. Copy your Form ID (e.g., `https://formspree.io/f/mqkrzyov`).
4. Set in `app.js`:
   ```javascript
   CONFIG.REMOTE_WEBHOOK_URL = 'https://formspree.io/f/your_form_id';
   ```

---

## Option C: Self-Hosted Python Server (Already Built!)

Run on your local machine or VPS:
```bash
python server.py
```
This stores all responses locally in `rsvps.json`, provides live statistics, and allows 1-click CSV exports.
