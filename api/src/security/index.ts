import cors from 'cors';

import { Express } from 'express';

const securitySetup = (app: Express, express: any) =>
    app.use(cors()).use(express.json()).use(express.static('public'));

export default securitySetup;
