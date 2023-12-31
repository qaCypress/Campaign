

//Основна функція, в якій виводиться вся інфа
function getCampaign(CAMPAIGN, PROJECT) {
    clearInput()
    refreshTable();
    Promise.all([
        fetch(`https://${PROJECT}cms.co/api/bonus/info/uuids=${CAMPAIGN}`).then(response => response.json()),
        fetch(`https://${PROJECT}cms.co/api/bonus/info/${CAMPAIGN}/CAMPAIGN`).then(response => response.json()),
        fetchdocdata()
      ])
        .then(([CmsApi, BoApi, DocApi]) => {
            if (!Array.isArray(BoApi)) {
                BoApi = [BoApi];
              }
         
              let docApi
              fetchdocdata()
              .then(result => {
                console.log(result);
                // Use the jsonData as needed
              })

              const transformedData = {};
              console.log( DocApi.length)
              // Iterate over the data rows starting from index 1
              for (let i = 1; i < DocApi.length; i++) {
                const row = DocApi[i];
                
                // Iterate over the row elements
                for (let j = 0; j < row.length; j++) {
                  const key = DocApi[0][j]; // Use the first row as keys
                  const value = row[j];
                  
                  if (!transformedData[key]) {
                    transformedData[key] = [];
                  }
                  
                  transformedData[key].push(value);
                }
              }
              
              console.log(transformedData);              
    
          // Merge the two datasets
          const mergedData = [CmsApi, BoApi, transformedData];
      
          // Process and use the merged data
          console.log(mergedData);
      
          // Populate the table with the merged data
          const tableBody = document.getElementById('table-body');
    
          let prop = ["GameName", "FS_count", "Restricts", "Currinces", "Allowed", "Spin_Price", "Vager", "Loyality_Points"]

          let getCamp = null
          
            for (let i = 0; i < transformedData.Campaign.length; i++) {
              if (transformedData.Campaign[i] === CAMPAIGN) {
                getCamp = i;
                break;
              }
            }
          
          console.log(CheckCond(BoApi,CmsApi,transformedData).BOINFO.VagCon[0])
          
          let D = CheckCond(BoApi,CmsApi,transformedData, getCamp).DOCINFO
          let DocData = [D.GamesCon[0], D.FSCon[0], D.RestrictsCon[0], '', D.AllowedCountryCon[0], D.FS_priceCon[0], D.VagerCon[0], '']

          let C = CheckCond(BoApi,CmsApi,transformedData).CMSINFO
          let CmsData = ["-", CmsApi[0].translations.title.no, C.rectrictCondition[0], C.currenciesCondition[0], C.allowedCountryCond[0], "-", "-", "-"]
    
          let B = CheckCond(BoApi,CmsApi,transformedData).BOINFO     
          let BOData = [B.gameCondition[0], B.freeSpinAmCondition[0], '-', '-', '-', B.freeSpinCondition[0], getFirstTwoDigits(B.VagCon[0]), B.LoyAlPoints[0]]
    
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

          translationsData(CmsApi, BoApi)
          
        })
        
}
//Функція що витягує інфу з доки
function fetchdocdata() {
    const apiKey = 'AIzaSyDq2L4D73Y5E9jqyN3jk67b9xE-xzghqkE';
    const sheetId = '1Ki7_umFCqQvwWH-s9gExvnbomP3bUrYW3s0VTv5aIpg';
    const range = 'A:BC'; // Specify the range of data to retrieve
    
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
//Функція що створює таблицю з описами
function translationsData(CmsApi, BoApi) {
    
    const tableBody = document.getElementById('table-body-trans');

    

    let languages = Object.keys(CmsApi[0].translations.title).sort()



    let title = Object.values(getSortedTrans(CmsApi[0].translations.title))


    let shortdesc = Object.values(getSortedTrans(CmsApi[0].translations.shortDescription))
    
    let desc = Object.values(getSortedTrans(CmsApi[0].translations.description))

    

    for (let i = 0; i < languages.length; i++){
        const row = document.createElement('tr');
        const Lang = document.createElement('td');
        const Title = document.createElement('td');
        const ShortDesc = document.createElement('td');
        const Desc = document.createElement('td');
    
        Lang.innerHTML = languages[i]
        Title.innerHTML = formatAPIText(BoApi, title[i])
        ShortDesc.innerHTML = formatAPIText(BoApi, shortdesc[i])
        Desc.innerHTML = formatAPIText(BoApi, desc[i]);
    
        row.appendChild(Lang);
        row.appendChild(Title);
        row.appendChild(ShortDesc);
        row.appendChild(Desc);
    
        tableBody.appendChild(row);
    }

}

//функція що сортує таблицю з описами по мовах
function getSortedTrans(data) {
    const sortedKeys = Object.keys(data).sort();
    const sortedData = {}
    for (const key of sortedKeys) {
        sortedData[key] = data[key];
      }

      return sortedData
}

function getFirstTwoDigits(number) {
  const numberAsString = number.toString();

  if(numberAsString.length === 1){
    return `x${numberAsString}`
  } 
  
  if(numberAsString.length === 3) {
    return `x${numberAsString.slice(0, 1)}`
  } 
  else {
    return `x${numberAsString.slice(0, 2)}`
  }

  //return numberAsString.length === 1 ? `x${numberAsString}` : `x${numberAsString.slice(0, 1)}`;
}
//test
//функція що форматує текст для таблиці з описами
function formatAPIText(BoApi, apiText) {
  const container = document.createElement('div');
  container.classList.add('cms-text');

  const variableRegex = /{%\s*"(.*?)":\s*"(.*?)".*?%}/g;

  let B = CheckCond(BoApi,'-','-').BOINFO
  const numberRegex = B.freeSpinAmCondition[0]; // Regular expression to match numbers

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

//Функція для очищення інпуту після натискання кнопки
function clearInput() {
    document.getElementById('campaign-input').value = '';
  }

//Функція для очищення таблиці при виклику нової кампанії
function refreshTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    const tableBody2 = document.getElementById('table-body-trans');
    tableBody2.innerHTML = '';
}

//функція щоб сховати першу таблицю
function toggleTableVisibility() {
    var table = document.getElementById("data-table");
    var heading = document.getElementById("campaign-heading");
    heading.classList.toggle("hidden");
    table.classList.toggle("hidden");
}

//Функція для перевірки інформації з цмс та бо, до прикладу, якщо фс в кампанії відсутні, то замість них в таблиці буде '-'
function CheckCond(BoApi, CmsApi, transformedData, getCamp = '') {

  const temPlateIndex = BoApi?.[0]?.additionalInfo?.templates?.length === 1 ? 0 : 1;

  let LoyalPoint = 0;

  const templates = BoApi[0].additionalInfo.templates;


  if(templates) {
    for (const template of templates) {
      const loyaltyPointsKey = Object.keys(template).find((key) => key.includes("LOYALTY-POINT-TPL"));
      if (loyaltyPointsKey) {
        const loyaltyPoints = template[loyaltyPointsKey];
        if (loyaltyPoints && Array.isArray(loyaltyPoints)) {
          LoyalPoint = loyaltyPoints[0].amount;
          //console.log('Loyalty Points Amount:', LoyalPoint);
          break; // Stop after finding the first occurrence
        }
      }
    }
  }

  

  let checker = {
    BOINFO: {
      freeSpinCondition: [
        BoApi?.[0]?.additionalInfo?.templates?.[temPlateIndex]?.freeSpinPrice?.EUR ?? '-'
        ],
      freeSpinAmCondition: [
        BoApi?.[0]?.additionalInfo?.templates?.[temPlateIndex]?.freeSpinsAmount ?? '-'
      ],
      gameCondition: [
        BoApi?.[0]?.additionalInfo?.templates?.[temPlateIndex]?.game ?? '-'
      ],
      VagCon: [
        BoApi?.[0]?.additionalInfo?.templates?.[temPlateIndex]?.wageringRequirement?.[0]?.requirement?.percentage ?? '0'
      ],
      LoyAlPoints: [
        LoyalPoint === 0 ? '-' : LoyalPoint
      ]
    },

    CMSINFO: {
        rectrictCondition: [
          CmsApi && CmsApi[0].restrictedCountries &&
          CmsApi[0].restrictedCountries.length !== 0
          ? CmsApi[0].restrictedCountries
          : '-'
        ],
        allowedCountryCond: [
          CmsApi && CmsApi[0].allowedCountries &&
          CmsApi[0].allowedCountries.length !== 0
          ? CmsApi[0].allowedCountries
          : '-'
        ],
        currenciesCondition: [
          CmsApi && CmsApi[0].allowedCurrencies &&
          CmsApi[0].allowedCurrencies.length !== 0
          ? CmsApi[0].allowedCurrencies
          : '-'
        ],
        
    },

    DOCINFO: {
      GamesCon: [
        transformedData.GameName ? transformedData.GameName[getCamp] : '-'
      ],
      FSCon: [
        transformedData.FS_count ?  transformedData.FS_count[getCamp] : '-'
      ],
      RestrictsCon: [
        transformedData.Restricts ? transformedData.Restricts[getCamp] : '-'
      ],
      AllowedCountryCon: [
        transformedData.Allowed ? transformedData.Allowed[getCamp] : '-'
      ],
      FS_priceCon: [
        transformedData.Spin_Price ? transformedData.Spin_Price[getCamp] : '-'
      ],
      VagerCon: [
        transformedData.Vager ? transformedData.Vager[getCamp] : '-'
      ]

    }

        
  }
  
  return checker
}





















