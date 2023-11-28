import { Router } from 'express';

import TxController from '../../controllers/v1/TxController';

const router = Router();
const txController = new TxController();

router.get('/confirmation', async (req, res) => {
    const hashParam: string[] = Array.isArray(req.query.hash)
        ? req.query.hash.map((q) => q as string)
        : [req.query.hash as string];

    const response = await txController.getConfirmationDetails(req, hashParam);
    res.json(response);
});

router.get('/confirmed', async (req, res) => {
    const fromParam: string = Array.isArray(req.query.from)
        ? (req.query.from[0] as string)
        : (req.query.from as string) || '';

    const poolParam: string = Array.isArray(req.query.pool)
        ? (req.query.pool[0] as string)
        : (req.query.pool as string) || '';

    const limitParam: number = Array.isArray(req.query.limit)
        ? Number(req.query.limit[0] as unknown)
        : Number(req.query.limit as unknown);

    const response = await txController.getConfirmedTransactions(
        req,
        fromParam,
        poolParam,
        limitParam
    );
    res.json(response);
});

router.get('/stats', async (req, res) => {
    const queryParam = req.query.query as string;
    const response = await txController.getTxStats(req, queryParam);
    res.json(response);
});

router.get('/timing', async (req, res) => {
    const response = await txController.getTxTiming();
    res.json(response);
});

router.get('/:hash', async (req, res) => {
    const response = await txController.getTxDetails(req.params.hash);
    res.json(response);
});

router.get('/', async (req, res) => {
    const queryParam: string = Array.isArray(req.query.query)
        ? (req.query.query[0] as string)
        : (req.query.query as string) || '';

    const pageNumberParam: number = Array.isArray(req.query.pageNumber)
        ? Number(req.query.pageNumber[0] as unknown)
        : Number(req.query.pageNumber as unknown);

    const response = await txController.getTxList(
        req,
        queryParam,
        pageNumberParam
    );
    res.json(response);
});

export default router;
