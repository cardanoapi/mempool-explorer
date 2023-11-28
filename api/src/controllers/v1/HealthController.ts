import { Get, Route, Tags } from 'tsoa';

@Tags('V1 Health')
@Route('/api/v1/health')
class HealthController {
    @Get('/')
    getHealthStatus() {
        return { status: 'API is up and running!' };
    }
}

export default HealthController;
