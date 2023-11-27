import { Get, Route, Tags } from 'tsoa';

@Tags('Health')
@Route('/api/v2/health')
class HealthController {
    @Get('/')
    getHealthStatus() {
        return { status: 'API is up and running!' };
    }
}

export default HealthController;
