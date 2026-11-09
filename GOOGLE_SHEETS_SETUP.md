# Cloud Backend Setup Guide (Google Sheets Live Sync)

Your live RSVP web application is now configured with your Google Apps Script Web App:
**`https://script.google.com/macros/s/AKfycbxODjyeAorYChxskg4slB70I219eMxvO5nBE70S73Qxf5AjCOl_ai3Fat8oO7uNbrmF/exec`**

---

## Google Sheet Script (`Code.gs`)

In your Google Sheet (**Extensions > Apps Script**), make sure `Code.gs` contains this code:

```javascript
// 1. Receives RSVPs submitted from guest phones/browsers and appends a row
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

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.referenceCode || '',
    data.fullName || data.name || '',
    cleanPhone,
    data.attending || '',
    data.guestCount || '1',
    data.dietary || 'Standard Menu',
    data.teaPreference || data.chaiStyle || 'Chai (Tea with Sugar)',
    data.message || data.notes || ''
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'RSVP recorded in Google Sheet'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 2. Returns all attendee rows so the Organiser Portal can read them live
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var rsvps = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1] || row[2]) {
      rsvps.push({
        submittedAt: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
        referenceCode: row[1] || '',
        fullName: row[2] || '',
        name: row[2] || '',
        phoneNumber: row[3] || '',
        phone: row[3] || '',
        attending: row[4] || 'yes',
        guestCount: parseInt(row[5], 10) || 1,
        dietary: row[6] || 'Standard Menu',
        teaPreference: row[7] || 'Chai (Tea with Sugar)',
        chaiStyle: row[7] || 'Chai (Tea with Sugar)',
        message: row[8] || '',
        notes: row[8] || ''
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    rsvps: rsvps
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## Note on Testing in Apps Script:
When you click **"Run"** directly inside the Apps Script editor, you will see `TypeError: Cannot read properties of undefined (reading 'postData')`. **This is normal and expected**, because clicking "Run" manually does not pass web form data. The script triggers automatically when a real RSVP is submitted from the website!
