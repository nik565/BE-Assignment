const expect = require('chai').expect;
const path = require('path');
const { parseCsvFile, parseXmlFile } = require('../utilities');

const pathOfMockCsvFile = path.join(__dirname, 'mockCSVFile.csv');
const pathOfMockXmlFile = path.join(__dirname, 'mockXMLFile.xml');
// const headersForCsvAndXmlFile = ['Reference', 'AccountNumber', 'Descripttion', 'Start Balance', 'Mutation', 'End Balance'];


describe('Test suite for this application', () => {

    describe('Csv File tests', () => {
        it('should successfully parse the CSV file', (done) => {
            parseCsvFile(pathOfMockCsvFile, (err, result) => {                
                expect(err).to.equal(null, 'Error should not be null');
                expect(result).to.not.equal(null, 'Result should not be equal null');
                expect(result).to.be.an('array', 'The result be of type array');
                done();
            });
        });

        it('should have all the required headers', (done) => {
            parseCsvFile(pathOfMockCsvFile, (err, result) => {
                expect(err).to.equal(null, 'Error should be equal to null');
                expect(result).with.lengthOf(3, 'The length should be 3');
                expect(result[0]).to.have.property('Reference');
                expect(result[0]).to.have.property('AccountNumber');
                expect(result[0]).to.have.property('Description');
                expect(result[0]).to.have.property('Start Balance');
                expect(result[0]).to.have.property('Mutation');
                expect(result[0]).to.have.property('End Balance');
                done();
            });
        });

        it('should have all the valid records', (done) => {
            parseCsvFile(pathOfMockCsvFile, (err, result) => {
                expect(err).to.equal(null, 'Error should be equal to null');
                expect(result).with.lengthOf(3, 'The length should be 3');
                expect(result[0]).to.have.property('Reference', 194261, '"Reference" should have an integer value');
                expect(result[0]).to.have.property('AccountNumber', 'NL91RABO0315273637', '"AccountNumber" should have non-space string as value');
                expect(result[0]).to.have.property('Description', 'Clothes from Jan Bakker', '"Description" should have non-space string as value');
                expect(result[0]).to.have.property('Start Balance', 21.6, '"Start Balance" should have Number as value');
                expect(result[0]).to.have.property('Mutation', -41.83, '"Mutation" should have Number as value');
                expect(result[0]).to.have.property('End Balance', -20.23, '"End Balance" should have Number as value');
                done();
            });
        });
    });

    describe('XML file tests', () => {
        it('should successfully parse the XML file', (done) => {
            parseXmlFile(pathOfMockXmlFile, (err, result) => {                
                expect(err).to.equal(null, 'Error should not be null');
                expect(result).to.not.equal(null, 'Result should not be equal null');
                expect(result).to.be.an('array', 'The result be of type array');
                done();
            });
        });

        it('should have all the required headers', (done) => {
            parseXmlFile(pathOfMockXmlFile, (err, result) => {
                expect(err).to.equal(null, 'Error should be equal to null');
                expect(result).with.lengthOf(3, 'The length should be 3');
                expect(result[0]).to.have.property('Reference');
                expect(result[0]).to.have.property('AccountNumber');
                expect(result[0]).to.have.property('Description');
                expect(result[0]).to.have.property('Start Balance');
                expect(result[0]).to.have.property('Mutation');
                expect(result[0]).to.have.property('End Balance');
                done();
            });
        });

        it('should have all the valid records', (done) => {
            parseXmlFile(pathOfMockXmlFile, (err, result) => {
                expect(err).to.equal(null, 'Error should be equal to null');
                expect(result).with.lengthOf(3, 'The length should be 3');
                expect(result[0]).to.have.property('Reference', 130498, '"Reference" should have an integer value');
                expect(result[0]).to.have.property('AccountNumber', 'NL69ABNA0433647324', '"AccountNumber" should have non-space string as value');
                expect(result[0]).to.have.property('Description', 'Tickets for Peter Theuß', '"Description" should have non-space string as value');
                expect(result[0]).to.have.property('Start Balance', 26.9, '"Start Balance" should have Number as value');
                expect(result[0]).to.have.property('Mutation', -18.78, '"Mutation" should have Number as value');
                expect(result[0]).to.have.property('End Balance', 8.12, '"End Balance" should have Number as value');
                done();
            });
        });
    });
});