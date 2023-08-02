import ReactSwagger from './react-swagger';
import {getApiDocs} from "@app/lib/swagger";

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section className="container">
            <ReactSwagger spec={spec}/>
        </section>
    );
}