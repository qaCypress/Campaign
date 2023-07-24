


// Load the Google Sheets API library
gapi.load('client', initClient);

function initClient() {
    gapi.client.init({
      apiKey: 'AIzaSyAIoEE_zYqRZ8Ca_AmEOI8XX1-BEIY9lU0',
      clientId: '316367094902-lne2l4k2dl9giqtn758ddhfpij8asv7q.apps.googleusercontent.com',
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
    }).then(() => {
      // API is initialized and ready to be used
      // Call the function to load data from the spreadsheet
      loadSpreadsheetData();
    }).catch((error) => {
      // Error occurred during initialization
      console.log('Error initializing API:', error);
    });
  }
  
  function handleClientLoad() {
    gapi.load('client', initClient);
  }






function loadSpreadsheetData() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1TwnAVc3yHllchsywcD3hAbh2MKMju4bx9MuqisYWW84',
      range: 'Лист1!A1:AF23' // Specify the range of cells you want to retrieve
    }).then((response) => {
      var values = response.result.values;
      if (values.length > 0) {
        // Process the retrieved values
        console.log(values);
      } else {
        console.log('No data found.');
      }
    }).catch((error) => {
      console.log('Error loading data from spreadsheet:', error);
    });
  }

