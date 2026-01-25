// Google Apps Script to receive Motion-Map submissions
// Deploy this as a Web App to get a URL for the form to post to

function doPost(e) {
  try {
    // Get the active spreadsheet and Submissions sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Submissions');
    
    // If Submissions sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet('Submissions');
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Country', 'State', 'City', 
        'Bio', 'Website', 'Instagram', 'VideoURL', 'PosterURL', 
        'PreferredMonth', 'Status'
      ]);
    }
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Append the submission to the sheet
    sheet.appendRow([
      new Date(), // Timestamp
      data.name || '',
      data.email || '',
      data.country || '',
      data.state || '',
      data.city || '',
      data.bio || '',
      data.website || '',
      data.instagram || '',
      data.videoUrl || '',
      data.posterUrl || '',
      data.preferredMonth || '',
      'Pending' // Status
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Submission received!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Artist',
        email: 'test@example.com',
        country: 'USA',
        state: 'NC',
        city: 'Charlotte',
        bio: 'Test bio',
        website: 'test.com',
        instagram: '@test',
        videoUrl: 'https://vimeo.com/123',
        posterUrl: 'https://example.com/image.jpg',
        preferredMonth: '2026-03'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
