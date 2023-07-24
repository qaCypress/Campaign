import {CheckCond} from "tableCodition.js";

function getCampaign(CAMPAIGN, PROJECT) {
  //Прив да-да
    clearInput()
    refreshTable();
    Promise.all([
        fetch(`https://${PROJECT}cms.co/api/bonus/info/uuids=${CAMPAIGN}`).then(response => response.json()),
        fetch(`https://${PROJECT}cms.co/api/bonus/info/${CAMPAIGN}/CAMPAIGN`).then(response => response.json()),
        fetchdocdata()
      ])
        .then(([data1, data2, data3]) => {
            if (!Array.isArray(data2)) {
                data2 = [data2];
              }
         
              let docApi
              fetchdocdata()
              .then(result => {
                console.log(result);
                // Use the jsonData as needed
              })

              const transformedData = {};

              // Iterate over the data rows starting from index 1
              for (let i = 1; i < data3.length; i++) {
                const row = data3[i];
                
                // Iterate over the row elements
                for (let j = 0; j < row.length; j++) {
                  const key = data3[0][j]; // Use the first row as keys
                  const value = row[j];
                  
                  if (!transformedData[key]) {
                    transformedData[key] = [];
                  }
                  
                  transformedData[key].push(value);
                }
              }
              
              console.log(transformedData);              
    
          // Merge the two datasets
          const mergedData = [data1, data2, transformedData];
      
          // Process and use the merged data
          console.log(mergedData);
      
          // Populate the table with the merged data
          const tableBody = document.getElementById('table-body');
    
          let prop = ["GameName", "FS count", "Restricts", "Spin Price"]

          let getCamp = null
          for (let i = 0; i < transformedData.Campaign.length; i++) {
            if (transformedData.Campaign[i] === CAMPAIGN) {
              getCamp = i;
              break;
            }
          }
          console.log( transformedData.FS_price[getCamp])
          let DocData = [transformedData.Games[getCamp], transformedData.FS[getCamp], transformedData.Restricts[getCamp], transformedData.FS_price[getCamp]]

          let CmsData = ["-", data1[0].translations.title.no, data1[0].restrictedCountries, "-"]
    
          let freeSpinCondition = [
            data2[0].additionalInfo.templates[0].freeSpinPrice && data2[0].additionalInfo.templates[0].freeSpinPrice['EUR'] !== undefined
            ? data2[0].additionalInfo.templates[0].freeSpinPrice['EUR']
            : '-'
          ]
          
          console.log(CheckCond(data2))
          console.log(freeSpinCondition[0])

  
          
          let BOData = [data2[0].additionalInfo.templates[0].game, data2[0].additionalInfo.templates[0].freeSpinsAmount, '-', freeSpinCondition[0]]
    
          for (let i = 0; i < prop.length; i++) {
            const row = document.createElement('tr');
            const propData = document.createElement('td');
            const docData = document.createElement('td');
            const cmsData = document.createElement('td');
            const boData = document.createElement('td');
      
            propData.textContent = prop[i]
            docData.textContent = DocData[i];
            cmsData.textContent = CmsData[i]
            boData.textContent = BOData[i];
      
            row.appendChild(propData);
            row.appendChild(docData);
            row.appendChild(cmsData);
            row.appendChild(boData);
      
            tableBody.appendChild(row);
    
          }

          translationsData(data1, data2)
          
        })
        .catch(error => console.error(error));
}

function fetchdocdata() {
    const apiKey = 'AIzaSyDq2L4D73Y5E9jqyN3jk67b9xE-xzghqkE';
    const sheetId = '1Ki7_umFCqQvwWH-s9gExvnbomP3bUrYW3s0VTv5aIpg';
    const range = 'A1:D7'; // Specify the range of data to retrieve
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
    
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        // Process the retrieved data and populate your HTML table
        //console.log(data.values); // Example: log the values to the console
        return data.values;
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function translationsData(data1, data2) {
    
    const tableBody = document.getElementById('table-body-trans');

    

    let languages = Object.keys(data1[0].translations.title).sort()



    let title = Object.values(getSortedTrans(data1[0].translations.title))


    let shortdesc = Object.values(getSortedTrans(data1[0].translations.shortDescription))
    
    let desc = Object.values(getSortedTrans(data1[0].translations.description))

    

    for (let i = 0; i < languages.length; i++){
        const row = document.createElement('tr');
        const Lang = document.createElement('td');
        const Title = document.createElement('td');
        const ShortDesc = document.createElement('td');
        const Desc = document.createElement('td');
    
        Lang.textContent = languages[i]
        Title.innerHTML = formatAPIText(title[i])
        ShortDesc.innerHTML = formatAPIText(shortdesc[i])
        Desc.innerHTML = formatAPIText(desc[i]);
    
        row.appendChild(Lang);
        row.appendChild(Title);
        row.appendChild(ShortDesc);
        row.appendChild(Desc);
    
        tableBody.appendChild(row);
    }

}

function getSortedTrans(data) {
    const sortedKeys = Object.keys(data).sort();
    const sortedData = {}
    for (const key of sortedKeys) {
        sortedData[key] = data[key];
      }

      return sortedData
}


function formatAPIText(apiText) {
  const container = document.createElement('div');
  container.classList.add('cms-text');

  const variableRegex = /{%\s*"(.*?)":\s*"(.*?)".*?%}/g;
  const numberRegex = /\b\d+\b/g; // Regular expression to match numbers

  let modifiedText = apiText.replace(variableRegex, '<a class="variable" data-variable="$1" href="#">{$1}</a>');

  // Replace numbers with highlighted numbers
  modifiedText = modifiedText.replace(numberRegex, '<span class="highlighted-number">$&</span>');

  container.innerHTML = modifiedText;

  container.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('variable')) {
      const variable = target.getAttribute('data-variable');
      const variableElements = container.querySelectorAll(`a.variable[data-variable="${variable}"]`);
      variableElements.forEach(function(element) {
        element.nextElementSibling.classList.toggle('hidden');
      });
    }
  });

  return container.innerHTML;
}

function clearInput() {
    document.getElementById('campaign-input').value = '';
  }

function refreshTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    const tableBody2 = document.getElementById('table-body-trans');
    tableBody2.innerHTML = '';
  }


  function toggleTableVisibility() {
    var table = document.getElementById("data-table");
    var heading = document.getElementById("campaign-heading");
    heading.classList.toggle("hidden");
    table.classList.toggle("hidden");
  }






















