import { Router } from 'express';

import EpochController from '../../controllers/v1/EpochController';

const router = Router();
const epochController = new EpochController();

router.get('/current', async (req, res) => {
    const response = await epochController.getCurrentEpoch();
    res.json(response);
});

export default router;
