import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/:app/:env/:start/:end', async (req, res) => {
    const { app, env, start, end } = req.params;

    const allEnvs = [];
    const unavailableEnvs = [];

    for (let i = start; i <= end; i++) {
        const environmentURL = `https://${env.replace("00", i)}`;
        const versionJSON = environmentURL + '/version.json';

        try {
            const envInfo = await (await fetch(versionJSON)).json();

            allEnvs.push({
                url: environmentURL,
                version: envInfo[app],
            });
        } catch (error) {
            unavailableEnvs.push({
                url: environmentURL
            });
            console.log('error to load: ', versionJSON);
            console.log(error);
        }
    }

    res.send({ available: allEnvs, unavailable: unavailableEnvs });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});