import { Router } from 'express';

import MempoolController from '../../controllers/v1/MempoolController';

const router = Router();
const mempoolController = new MempoolController();

router.get('/size', async (req, res) => {
    const response = await mempoolController.getMempoolSize();
    res.json(response);
});

export default router;
