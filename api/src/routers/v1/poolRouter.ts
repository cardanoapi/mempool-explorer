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

export default router;
