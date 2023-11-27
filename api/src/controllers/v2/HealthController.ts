import { Get, Route, Tags } from 'tsoa';

@Tags('V2 Health')
@Route('/api/v2/health')
class HealthController {
    @Get('/')
    getHealthStatus() {
        return { status: 'API is up and running!' };
    }
}

export default HealthController;
