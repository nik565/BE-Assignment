const fs = require('fs');
const csvtojson = require('csvtojson');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

/**
 * CONVERTING STRING TO NUMBER
 * @param {*} item -> object value to be transformed to Number
 */
const convertStringToNumber = (item) => {
    return Number(item);
};

/**
 * CHECKING THE PRESENCE OF A DIRECTORY, IF NOT PRESENT THEN CREATE IT
 * @param {*} path -> path of the directory to create
 * @param {*} done -> Callback to execute in case of any error or completion of this function
 */
const ensureExists = (path, done) => {
    fs.mkdir(path, (err) => {
        if(err) {
            if(err.code === 'EEXIST') {
                return done(null);
            } else {
                return done(err);
            }
        } else {
            return done(null);
        }
    });
};

/**
 * PARSING of CSV FILE
 * @param {*} pathOfCsvFile -> path of the CSV file present on the disk
 * @param {*} done -> Callback to execute in case of any error or completion of this function
 */
const parseCsvFile = (pathOfCsvFile, done) => {
    let headerColumn = [];
    const parsedRecordsFromCsvFile = [];

    csvtojson({
        colParser: {
            'Reference': convertStringToNumber,
            'Start Balance': convertStringToNumber,
            'Mutation': convertStringToNumber,
            'End Balance': convertStringToNumber
        }
    }).fromFile(pathOfCsvFile)
        .on('header', header => {
            headerColumn = header.slice(0);
        })
        .on('data', bufferObj => {
            const row = JSON.parse(bufferObj);
            if(Object.keys(row).length === headerColumn.length) {
                parsedRecordsFromCsvFile.push(row);
            }
        })
        .on('error', err => {
            // console.log('error occurred while reading a csv file', err);
            return done(err);
        })
        .on('done', error => {
            if(error) {
                // console.log('error occurred while reading a csv file (during done event)', error);
                return done(error);
            } else {
                return done(null, parsedRecordsFromCsvFile);
            }
        });
};


/**
 * PARSING of XML FILE
 * @param {*} pathOfXmlFile -> path of the XML file present on the disk
 * @param {*} done -> Callback to execute in case of any error or completion of this function
 */
const parseXmlFile = (pathOfXmlFile, done) => {
    const readStream = fs.createReadStream(pathOfXmlFile, 'utf8');
    let xmlText = '';

    readStream.on('data', chunk => {
        xmlText += chunk;
    }).on('error', (err) => {
        //console.log('Error occurred while reading xml file', err);
        return done(err);
    }).on('end', () => {
        //console.log('Reading xml file is done');
        parser.parseString(xmlText, (err, result) => {
            if(err) {
                //console.log('Error occured while parsing xml records', err);
                return done(err);
            } else {
                const parsedXmlFile = result['records']['record'];
                parsedXmlFile.map(item => {
                    item['Reference'] = Number(item['$']['reference']);
                    item['AccountNumber'] = item['accountNumber'][0];
                    item['Description'] = item['description'][0];
                    item['Start Balance'] = Number(item['startBalance'][0]);
                    item['Mutation'] = Number(item['mutation'][0]);
                    item['End Balance'] = Number(item['endBalance'][0]);
                    delete item['$'];
                    delete item['accountNumber'];
                    delete item['description'];
                    delete item['startBalance'];
                    delete item['mutation'];
                    delete item['endBalance'];
                });
                //console.log(parsedXmlFile, parsedXmlFile.length);
                return done(null, parsedXmlFile);
            }
        });
    });
};

module.exports = {
    ensureExists,
    parseCsvFile,
    parseXmlFile
};