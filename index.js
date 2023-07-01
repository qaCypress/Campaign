

function getCampaign(CAMPAIGN, PROJECT) {

    clearInput()
    refreshTable();
    fetchdocdata()
    Promise.all([
        fetch(`https://${PROJECT}cms.co/api/bonus/info/uuids=${CAMPAIGN}`).then(response => response.json()),
        fetch(`https://${PROJECT}cms.co/api/bonus/info/${CAMPAIGN}/CAMPAIGN`).then(response => response.json())
      ])
        .then(([data1, data2]) => {
            if (!Array.isArray(data2)) {
                data2 = [data2];
              }
    
          // Merge the two datasets
          const mergedData = [...data1, ...data2];
      
          // Process and use the merged data
          console.log(mergedData);
      
          // Populate the table with the merged data
          const tableBody = document.getElementById('table-body');
    
          let prop = ["GameName", "FS count", "Restricts"]
    
          let CmsData = ["-", data1[0].translations.title.no, data1[0].restrictedCountries]
    
          let BOData = [data2[0].additionalInfo.templates[0].game, data2[0].additionalInfo.templates[0].freeSpinsAmount, '-']
    
          for (let i = 0; i < prop.length; i++) {
            const row = document.createElement('tr');
            const propData = document.createElement('td');
            const docData = document.createElement('td');
            const cmsData = document.createElement('td');
            const boData = document.createElement('td');
      
            propData.textContent = prop[i]
            docData.textContent = "";
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
    const sheetId = '1TwnAVc3yHllchsywcD3hAbh2MKMju4bx9MuqisYWW84';
    const range = 'B1:B2'; // Specify the range of data to retrieve
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1_uvJOLvFZ-S-wQXOxUrM4-qxgegYraUUW6-59hgHO2s/values:batchGet?ranges=H3:H10&ranges=D3:D10&key=AIzaSyCNMwgRQjntdquqKkb52r_2jcgpMQb0LXw`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Process the retrieved data and populate your HTML table
        console.log(data.values); // Example: log the values to the console
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function translationsData(data1, data2) {
    
    const tableBody = document.getElementById('table-body-trans');

    

    let languages = Object.keys(data1[0].translations.title).sort()
    console.log(languages)



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
        const variableElements = container.querySelectorAll(`span[data-variable="${variable}"]`);
        variableElements.forEach(function(element) {
          element.classList.toggle('hidden');
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




/*
async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead")
    const tableBody = table.querySelector("tbody")
    const response = await fetch(url)
    const {headers, rows} = await response.json()

    //Clear the table
    tableHead.innerHTML = "<tr></tr>"
    tableHead.innerHTML = ""

    headerss = {"headerss": ['ds','ds']}

    for (const headerText of headerss) {
        const headerElement = document.createElement('th')

        headerElement.textContent = headerText
        tableHead.querySelector("tr").appendChild(headerElement)
    }

}

loadIntoTable("https://allrightcasino.nascms.co/api/bonus/info/uuids=CAMPAIGN-7b136172-01b5-4290-b30e-6add18a6b506", document.querySelector("table"))*/


















