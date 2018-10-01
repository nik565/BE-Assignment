const router = require('express').Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const { ensureExists } = require('../../../utilities');
const xmlController = require('./xmlController');
const logger = require('../../../logger');


router.post('/xmlUpload', (req, res) => {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
    ensureExists(uploadDir, (err) => {
        if(err) {
            return res.status(500).json({upload: 'unsuccessful'});
        } else {
            const form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
            form.parse(req);
            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                fs.rename(file.path, form.uploadDir + '/' + file.name);
            });
            form.on('error', (err) => {
                logger.error('Error occurred while uploading the XML file on server', err);
                return res.status(500).json({upload: 'unsuccessful'});
            });
            form.on('aborted', (err) => {
                logger.error('Error occurred while uploading the XML file on server', err);
                return res.status(500).json({upload: 'unsuccessfull'});
            });
            form.on('end', () => {
                logger.info('XML File upload completed successfully without any error');
                xmlController.processXmlFile((err, result) => {
                    if(err) {
                        logger.error('Something went wrong while processing XML File', err);
                        return res.status(500).json({
                            message: 'Something went wrong while processing XML File',
                            error: err
                        });
                    } else {
                        res.status(200).send(result);
                    }
                });
            });             
        }
    });
    
});

module.exports = router;