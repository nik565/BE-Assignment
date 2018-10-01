const app = require('../index');
const port = (process.env.PORT || 3000);
const logger = require('../logger');

app.listen(port, () => {
    logger.info(` Server is listening on ${port}`);
}).on('error', err => {
    if(err.errno === 'EADDRINUSE') {
        logger.error(`current port ${port} is in use, please run the server on different port`);
    } else {
        logger.error('error while starting up the server: ', err);
    }
}).on('request', req => {
    logger.info('*********** Getting a new request **********', req.url);
});