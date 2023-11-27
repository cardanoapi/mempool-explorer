import { Router } from 'express';

import HealthController from '../../controllers/v2/HealthController';

const router = Router();
const healthCheckController = new HealthController();

router.get('/', (req, res) => {
    const response = healthCheckController.getHealthStatus();
    res.json(response);
});

export default router;
