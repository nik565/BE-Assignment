const router = require('express').Router();
const csvRouter = require('./csv');
const xmlRouter = require('./xml');

router.use('/csv', csvRouter);
router.use('/xml', xmlRouter);

module.exports = router;