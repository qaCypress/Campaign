


// Load the Google Sheets API library
gapi.load('client', initClient);

// Initialize the API client
function initClient() {
  gapi.client.init({
    apiKey: 'AIzaSyDq2L4D73Y5E9jqyN3jk67b9xE-xzghqkE',
    clientId: '1073747679642-cq0q4aveq98jsjnqb19ae0ckiit5u2ep.apps.googleusercontent.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  }).then(function() {
    // Authorize and make API requests
    gapi.auth2.getAuthInstance().signIn().then(function() {
      // Authenticated successfully
      // Make API requests
      getDataFromSheet();
    });
  });
}

// Fetch data from Google Sheets
function getDataFromSheet() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1TwnAVc3yHllchsywcD3hAbh2MKMju4bx9MuqisYWW84',
    range: 'Sho!A1:B5' // Specify the range you want to read
  }).then(function(response) {
    var values = response.result.values;
    if (values.length > 0) {
      // Process the retrieved data
      console.log('Data from Google Sheets:', values);
    } else {
      console.log('No data found.');
    }
  }, function(error) {
    console.error('Error fetching data:', error);
  });
}