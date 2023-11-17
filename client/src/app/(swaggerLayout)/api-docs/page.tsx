import { getApiDocs } from '@app/lib/swagger';

import ReactSwagger from './react-swagger';

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section className="mt-[-50px] !bg-white h-screen">
            <ReactSwagger spec={spec}/>
        </section>
    );
}
