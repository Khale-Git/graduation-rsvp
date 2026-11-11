# Cloud Backend Setup Guide (Google Sheets Live Sync)

Your live RSVP web application is now configured with your Google Apps Script Web App:
**`https://script.google.com/macros/s/AKfycbxODjyeAorYChxskg4slB70I219eMxvO5nBE70S73Qxf5AjCOl_ai3Fat8oO7uNbrmF/exec`**

---

## Google Sheet Script (`Code.gs`)

In your Google Sheet (**Extensions > Apps Script**), make sure `Code.gs` contains this code:

```javascript
// 1. Receives RSVPs or edits submitted from guest phones/browsers & organiser portal (Upsert by Reference Code)
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rawData = e.postData.contents;
  var data = JSON.parse(rawData);

  // Format phone number as plain text with leading apostrophe to prevent Google Sheets #ERROR! formula parsing
  var rawPhone = data.phoneNumber || data.phone || '';
  var cleanPhone = rawPhone.toString().trim();
  if (cleanPhone.indexOf('+') === 0 && cleanPhone.indexOf("'") !== 0) {
    cleanPhone = "'" + cleanPhone;
  }

  var refCode = (data.referenceCode || '').toString().trim();
  var rowValues = [
    data.timestamp || new Date().toISOString(),
    refCode,
    data.fullName || data.name || '',
    cleanPhone,
    data.attending || 'Yes',
    data.guestCount || '1',
    data.dietary || 'Standard Menu',
    data.teaPreference || data.chaiStyle || 'Chai (Tea with Sugar)',
    data.message || data.notes || ''
  ];

  // Check if Reference Code already exists -> update row in-place instead of duplicating
  var allRows = sheet.getDataRange().getValues();
  var updatedExisting = false;
  if (refCode) {
    for (var i = 1; i < allRows.length; i++) {
      if ((allRows[i][1] || '').toString().trim().toUpperCase() === refCode.toUpperCase()) {
        sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
        updatedExisting = true;
        break;
      }
    }
  }

  if (!updatedExisting) {
    sheet.appendRow(rowValues);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    updated: updatedExisting,
    message: updatedExisting ? 'RSVP updated in Google Sheet' : 'RSVP recorded in Google Sheet'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 2. Returns all attendee rows so the Organiser Portal & Guest Lookup read live across ALL devices
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var rsvps = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var ref = (row[1] || '').toString().trim();
    var fullName = (row[2] || '').toString().trim();
    if (!ref && !fullName) continue;
    // Skip connection test rows
    if (ref === 'IKG-TEST' || ref === 'IKG-SAFE') continue;

    rsvps.push({
      submittedAt: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
      referenceCode: ref,
      fullName: fullName,
      name: fullName,
      phoneNumber: (row[3] || '').toString(),
      phone: (row[3] || '').toString(),
      attending: row[4] || 'Yes',
      guestCount: parseInt(row[5], 10) || 1,
      dietary: row[6] || 'Standard Menu',
      teaPreference: row[7] || 'Chai (Tea with Sugar)',
      chaiStyle: row[7] || 'Chai (Tea with Sugar)',
      message: (row[8] || '').toString(),
      notes: (row[8] || '').toString()
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    rsvps: rsvps
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### ⚠️ Important: Re-Deploy After Pasting!
Saving `Code.gs` alone is not enough for Apps Script to update the live URL. After pasting:
1. Click **Deploy** (top right) → **Manage deployments**.
2. Click the **Pencil (Edit)** icon on your active Web App deployment.
3. Under **Version**, select **New version**.
4. Make sure **Who has access** is **Anyone** and click **Deploy**.

Once deployed, every phone and computer reading the website will automatically pull the latest Google Sheet rows (`Jane Doe`, `Bobby Kanyi`, and any new guests or edits) in real time!

---

## Note on Testing in Apps Script:
When you click **"Run"** directly inside the Apps Script editor, you will see `TypeError: Cannot read properties of undefined (reading 'postData')`. **This is normal and expected**, because clicking "Run" manually does not pass web form data. The script triggers automatically when a real RSVP is submitted from the website!
