# NafaVerse Survey Website

A beautiful, responsive survey website built with React, TypeScript, and Tailwind CSS. This application collects user feedback for NafaVerse, Pakistan's smart finance platform, and automatically submits data to Google Sheets.

## Features

- 🎨 Modern dark blue theme with gradient backgrounds
- 📱 Fully responsive design optimized for mobile
- 🔄 Multi-step form with progress tracking
- 📊 Google Sheets integration for data collection
- ✨ Smooth animations and micro-interactions
- 🔒 Privacy-focused with anonymous data collection
- 🌙 Dark theme optimized for finance/fintech branding

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building
- **Google Sheets API** for data storage

## Google Sheets Integration Setup

To connect this form to your Google Sheets:

1. Create a new Google Sheet
2. Go to Extensions → Apps Script
3. Replace the default code with this Google Apps Script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
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
    }
    
    // Add the data row
    const row = [
      data.timestamp, data.name, data.ageGroup, data.gender, data.income,
      data.saveMethod, data.trackExpenses, data.noTrackingReason, 
      data.financialDecision, data.investmentHistory, data.investmentExperience,
      data.investmentBarriers, data.interestTopics, data.learningPreference,
      data.scenarioMoney, data.scenarioFriend, data.desiredTool, 
      data.pilotInterest, data.contact
    ];
    
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    
    return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

4. Save the script and deploy it as a web app
5. Copy the web app URL and update the `GOOGLE_SHEETS_URL` in `src/utils/googleSheets.ts`

## Survey Structure

The survey is organized into 6 sections:

1. **Basic Profile** - Demographics and income status
2. **Money Habits** - Saving preferences and tracking behavior
3. **Investments & Barriers** - Investment history and obstacles
4. **Learning & Confidence** - Topics of interest and learning preferences
5. **Scenario-Based Thinking** - Real-world financial scenarios
6. **Wrap-Up** - Feature requests and pilot program interest

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Mobile Optimization

The website is fully optimized for mobile devices with:
- Touch-friendly button sizes (minimum 44px)
- Responsive grid layouts
- Optimized typography scaling
- Smooth scroll behavior
- Fast loading times

## Privacy & Security

- All responses are completely anonymous
- No tracking cookies or analytics
- Optional contact information only
- Secure HTTPS data transmission
- GDPR-compliant data handling

## Customization

To customize for your own survey:
1. Update the survey questions in the step components
2. Modify the branding colors in Tailwind config
3. Replace the Google Sheets URL with your own
4. Adjust the form validation logic as needed

## Contributing

This is a custom survey for NafaVerse. If you'd like to use this template for your own project, feel free to fork and modify!