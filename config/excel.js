const xlsx = require('node-xlsx');


module.exports = {
    async storcustomerrule() {
        const workSheetsFromFile = xlsx.parse('./excel/Customer.xlsx');
        var arrayrules = []
        for (const row of workSheetsFromFile[0].data) {
            if (row[4] != "Name") {
                if (row[4] == undefined) {
                    var rule = Object()
                    rule.name = row[1]
                } else {
                    rule.rule = row[4]
                    arrayrules.push(rule)
                }
            }
        }
        return arrayrules
    },

    async storitensrule() {
        const workSheetsFromFile = await xlsx.parse('./excel/Price.xlsx');
        var arrayrules = []
        for (const rowrule in workSheetsFromFile[0].data[0]) {
            if (workSheetsFromFile[0].data[0][rowrule] != undefined) {
                var rule = Object()
                rule.rulename = workSheetsFromFile[0].data[0][rowrule]
                
                var arrayitens = []
                for (const rowprice in workSheetsFromFile[0].data) {
                    if (workSheetsFromFile[0].data[rowprice][rowrule] != undefined){
                        var item = Object()
                        item.price = workSheetsFromFile[0].data[rowprice][rowrule]
                        for (const rowitem of workSheetsFromFile[0].data[rowprice]) {
                            if (rowitem != undefined){
                                item.name = rowitem.split(' (')[0]
                                arrayitens.push(item)
                                break;
                            }
                        }
                    }
                }
                rule.itens = arrayitens
                arrayrules.push(rule)
            }
        }
        return arrayrules
    }

}