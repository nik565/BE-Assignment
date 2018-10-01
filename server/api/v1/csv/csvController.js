const path = require('path');
const { parseCsvFile } = require('../../../utilities');

const isNumber = (value) => {
    return value !== undefined && typeof value === 'number' && !isNaN(value);
};

const isEndBalanceValid = (record) => {
    const tempSummation = (record['Start Balance'] + record['Mutation']).toFixed(2);
    return record['End Balance'] === +tempSummation;
};

const compareFunction = (firstObject, secondObject) => {
    return firstObject['Reference'] - secondObject['Reference'];
};


const processCsvFile = (done) => {

    const pathOfCsvFile = path.join(__dirname, '..', '..', '..', 'uploads/records.csv');

    const invalidCsvFile = [];

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
            invalidCsvFile.push(record);
            return false;
        }
    };

    parseCsvFile(pathOfCsvFile, (err, parsedRecordsFromCsvFile) => {
        if(err) {
            return done(err);
        } else {
            processFile(parsedRecordsFromCsvFile);
        }
    });
    
    
    const processFile = (parsedRecordsFromCsvFile) => {
    
        parsedRecordsFromCsvFile.sort(compareFunction);
        const ListOfUniqueReferences = new Set();
        const ListOfDuplicateReferences = new Map();
        const uniqueRecordsFromCsvFile = [];
        parsedRecordsFromCsvFile.map( item => {
            if(!ListOfUniqueReferences.has(item['Reference'])) {
                ListOfUniqueReferences.add(item['Reference']);
                uniqueRecordsFromCsvFile.push(item);
            } else {
                const occurrenceCount = ListOfDuplicateReferences.get(item['Reference']) || 0;
                if(occurrenceCount >= 0) {
                    ListOfDuplicateReferences.set(item['Reference'], item['Description']);
                }
            }
        });
        
    
        const validCsvFile = uniqueRecordsFromCsvFile.filter(validateFile);
        
        const listOfFailedCsvRecords = [];
        
        ListOfDuplicateReferences.forEach((value, key) => {
            const content = {
                Reference: key,
                Description: value,
                Reason: 'Duplicate Record'
            };
            listOfFailedCsvRecords.push(content);
        });

        invalidCsvFile.forEach((value) => {
            const content = {
                Reference: value['Reference'],
                Description: value['Description'],
                Reason: 'Invalid End Balance'
            };
            listOfFailedCsvRecords.push(content);
        });

        listOfFailedCsvRecords.sort(compareFunction);
        // console.log(listOfFailedCsvRecords);
        const result = {
            validCsvFile: validCsvFile,
            listOfFailedCsvRecords: listOfFailedCsvRecords
        };
        return done(null, result);
    };
};

module.exports = {
    processCsvFile
};