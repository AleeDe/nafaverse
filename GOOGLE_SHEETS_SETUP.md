# Google Sheets Integration Setup Guide

## Step 1: Set up Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1wBwMEsYR4oPJ6MtQ8v894pD2-6rs9tWn6Yb2NH2y4Lg/edit
2. Click on **Extensions** → **Apps Script**
3. Delete the default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.openById('1wBwMEsYR4oPJ6MtQ8v894pD2-6rs9tWn6Yb2NH2y4Lg').getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // If this is the first submission, add headers
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Name', 'Age Group', 'Gender', 'Income', 'Save Method',
        'Track Expenses', 'No Tracking Reason', 'Financial Decision', 
        'Investment History', 'Investment Experience', 'Investment Barriers',
        'Interest Topics', 'Learning Preference', 'Scenario Money', 
        'Scenario Friend', 'Desired Tool', 'Pilot Interest', 'Contact'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#1e40af');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }
    
    // Add the data row
    const row = [
      data.timestamp,
      data.name,
      data.ageGroup,
      data.gender,
      data.income,
      data.saveMethod,
      data.trackExpenses,
      data.noTrackingReason,
      data.financialDecision,
      data.investmentHistory,
      data.investmentExperience,
      data.investmentBarriers,
      data.interestTopics,
      data.learningPreference,
      data.scenarioMoney,
      data.scenarioFriend,
      data.desiredTool,
      data.pilotInterest,
      data.contact
    ];
    
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success', row: sheet.getLastRow()}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('NafaVerse Survey API is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Step 2: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Choose type: **Web app**
3. Set these options:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 3: Update the Website

The Web App URL from step 2 needs to be added to the website code.

## Step 4: Test the Integration

1. Submit a test survey on your website
2. Check your Google Sheet to see if the data appears
3. The first submission will create headers automatically

## Troubleshooting

- Make sure the Google Apps Script has permission to access your spreadsheet
- Ensure the Web App is deployed with "Anyone" access
- Check the Apps Script logs if submissions aren't working
- Test the Web App URL directly in your browser - it should show "NafaVerse Survey API is working!"