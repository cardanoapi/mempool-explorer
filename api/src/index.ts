import express, { Express } from 'express';

import appSetup from './init';
import routerSetup from './init/routerSetup';
import securitySetup from './security';
import middlewareSetup from './middlewares';

const index: Express = express();

appSetup(index);
securitySetup(index, express);
middlewareSetup(index);
routerSetup(index);
