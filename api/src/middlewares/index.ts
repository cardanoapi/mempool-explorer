import { Express } from 'express';

import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

const middlewareSetup = (app: Express) => {
    app.use(morgan(':method :url :status :http-version :response-time '));
    setTimeout(() => {
        app.use(
            '/api/docs',
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: '/swagger.json'
                }
            })
        );
    }, 1000); // Adjust the delay as needed
};

export default middlewareSetup;
