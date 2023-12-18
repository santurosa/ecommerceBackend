import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    req.logger.fatal('Fatal error')
    req.logger.error('Error')
    req.logger.warning('Warning')
    req.logger.info('Info')
    req.logger.http('HTTP')
    req.logger.debug('Debug')
    res.send({ status: 'success', message: 'Loggers working correctly.' });
})

export default router;