const path = require('path');
const { parseXmlFile } = require('../../../utilities');


const compareFunction = (firstObject, secondObject) => {
    return firstObject['Reference'] - secondObject['Reference'];
};

const isNumber = (value) => {
    return value !== undefined && typeof value === 'number' && !isNaN(value);
};

const isEndBalanceValid = (record) => {
    const tempSummation = (record['Start Balance'] + record['Mutation']).toFixed(2);
    return record['End Balance'] === +tempSummation;
};


const processXmlFile = (done) => {

    const pathOfXmlFile = path.join(__dirname, '..', '..', '..', 'uploads/records.xml');
    
    parseXmlFile(pathOfXmlFile, (err, parsedXmlFile) => {
        if(err) {
            return done(err);
        } else {
            processFile(parsedXmlFile);
        }
    });
    
    const processFile = (parsedXmlFile) => {
        parsedXmlFile.sort(compareFunction);
        const ListOfUniqueReferences = new Set();
        const ListOfDuplicateReferences = new Map();
        const uniqueRecordsFromXmlFile = [];
        parsedXmlFile.map( item => {
            if(!ListOfUniqueReferences.has(item['Reference'])) {
                ListOfUniqueReferences.add(item['Reference']);
                uniqueRecordsFromXmlFile.push(item);
            } else {
                const occurrenceCount = ListOfDuplicateReferences.get(item['Reference']) || 0;
                if(occurrenceCount >= 0) {
                    ListOfDuplicateReferences.set(item['Reference'], item['Description']);
                }
            }
        });
    
        const invalidXmlFile = [];
    
        const validateFile = (record) => {
            if(isNumber(record['Reference']) && 
                isNumber(record['Start Balance']) && 
                isNumber(record['Mutation']) && 
                isNumber(record['End Balance']) && 
                record['AccountNumber'] !== '' &&
                record['Description'] !== '' &&
                isEndBalanceValid(record)) {
                return true;
            } else {
                invalidXmlFile.push(record);
                return false;
            }
        };
    
        const validXmlFile = uniqueRecordsFromXmlFile.filter(validateFile);
        //console.log('Valid xml file', validXmlFile);
        const listOfFailedXmlRecords = [];
    
        ListOfDuplicateReferences.forEach((value, key) => {
            const content = {
                Reference: key,
                Description: value,
                Reason: 'Duplicate Record'
            };
            listOfFailedXmlRecords.push(content);
        });
    
        invalidXmlFile.forEach((value) => {
            const content = {
                Reference: value['Reference'],
                Description: value['Description'],
                Reason: 'Invalid End Balance'
            };
            listOfFailedXmlRecords.push(content);
        });
    
        listOfFailedXmlRecords.sort(compareFunction);
        //console.log('Failed records', listOfFailedXmlRecords);
        const result = {
            validXmlFile: validXmlFile,
            listOfFailedXmlRecords: listOfFailedXmlRecords
        };

        return done(null, result);
    };
};

module.exports = {
    processXmlFile
};
