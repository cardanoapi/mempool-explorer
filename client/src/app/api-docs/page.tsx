import ReactSwagger from './react-swagger';
import {getApiDocs} from "@app/lib/swagger";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import backgroundColor = _default.defaults.backgroundColor;

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section style={{marginTop: "-50px;", backgroundColor: "white", height: "100vh;"}}>
            <ReactSwagger spec={spec}/>
        </section>
    );
}