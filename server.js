import  fetch  from "node-fetch";
import  express  from "express";
import  cors  from "cors";
import  bodyParser  from "body-parser";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/:app/:env/:start/:end', async (req, res) => {
    const { app, env, start, end } = req.params;

    const allEnvs = [];

    for (let i = start; i <= end; i++) {
        const environmentURL = `https://${env.replace("00", i)}`;
        const versionJSON = environmentURL + '/version.json';

        const envInfo = await(await fetch(versionJSON)).json();    
        
        allEnvs.push({
            url: environmentURL,
            version: envInfo[app],
        });
    }

    res.send(allEnvs);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});