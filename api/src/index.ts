import express, { Express } from 'express';

import appSetup from './init';
import routerSetup from './init/routerSetup';
import securitySetup from './security';
import middlewareSetup from './middlewares';

// toJSON for BigInt
Object.defineProperty(BigInt.prototype, "toJSON", {
    get() {
        "use strict";
        return () => String(this);
    }
});

const index: Express = express();

appSetup(index);
securitySetup(index, express);
middlewareSetup(index);
routerSetup(index);
