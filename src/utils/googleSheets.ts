// Replace this URL with your Google Apps Script Web App URL after deployment
const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxcx-nEX9KzThkZ0FyzNOUiNS2PqfoCWoy_F9gwbb6RQ_hI89N4Bw9KDEzYQeSaTIMNxg/exec';

export async function submitToGoogleSheets(data: any): Promise<void> {
  // Prepare the data for Google Sheets
  const formattedData = {
    timestamp: new Date().toISOString(),
    name: data.name || 'Not provided',
    ageGroup: data.ageGroup,
    gender: data.gender,
    income: data.income,
    saveMethod: data.saveMethod || 'N/A',
    trackExpenses: data.trackExpenses,
    noTrackingReason: Array.isArray(data.noTrackingReason) ? data.noTrackingReason.join(', ') : '',
    financialDecision: data.financialDecision,
    investmentHistory: data.investmentHistory,
    investmentExperience: data.investmentExperience || 'N/A',
    investmentBarriers: Array.isArray(data.investmentBarriers) ? data.investmentBarriers.join(', ') : '',
    interestTopics: Array.isArray(data.interestTopics) ? data.interestTopics.join(', ') : '',
    learningPreference: data.learningPreference,
    scenarioMoney: data.scenarioMoney,
    scenarioFriend: data.scenarioFriend,
    desiredTool: data.desiredTool,
    pilotInterest: data.pilotInterest,
    contact: data.contact || 'Not provided',
  };

  try {
    // Use no-cors + text/plain to avoid preflight; response will be opaque
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(formattedData),
    });

    // Can't read response in no-cors mode; assume success if no network error
    console.log('Survey submission sent.');
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
}