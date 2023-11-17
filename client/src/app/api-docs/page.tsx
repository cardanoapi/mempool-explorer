import ReactSwagger from './react-swagger';
import {getApiDocs} from "@app/lib/swagger";

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section className="mt-[-50px] bg-white h-screen">
            <ReactSwagger spec={spec}/>
        </section>
    );
}