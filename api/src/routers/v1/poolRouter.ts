import { Router } from 'express';

import PoolController from '../../controllers/v1/PoolController';

const router = Router();
const poolController = new PoolController();

router.get('/distribution', async (req, res) => {
    const response = await poolController.getPoolDistribution();
    res.json(response);
});

router.get('/timing', async (req, res) => {
    const response = await poolController.getPoolTiming();
    res.json(response);
});

// TODO : Replace the redudnant declaration of router get endpoints
router.get('/:poolId/epoch', async (req, res) => {
    const response = await poolController.getPoolEpochInfo(req.params.poolId);
    res.json(response);
});

router.get('/:poolId/transactions', async (req, res) => {
    const response = await poolController.getPoolTransactions(req.params.poolId, Number.parseInt(req.query.pageNumber as string));
    res.json(response);
});

router.get('/:poolId/transaction-timing', async (req, res) => {
    const response = await poolController.getPoolTransactionTiming(req.params.poolId);
    res.json(response);
});


export default router;
