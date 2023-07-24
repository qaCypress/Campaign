
export default CheckCond

function CheckCond(data2) {

    let checker = {
        freeSpinCondition : [
            data2[0].additionalInfo.templates[0].freeSpinPrice && data2[0].additionalInfo.templates[0].freeSpinPrice['EUR'] !== undefined
            ? data2[0].additionalInfo.templates[0].freeSpinPrice['EUR']
            : '-'
          ]
    }
    
    return checker
}