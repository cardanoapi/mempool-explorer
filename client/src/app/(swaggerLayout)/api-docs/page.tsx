import { getApiDocs } from '@app/lib/swagger';

import ReactSwagger from './react-swagger';

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section className="container !bg-white">
            <ReactSwagger spec={spec} />
        </section>
    );
}
