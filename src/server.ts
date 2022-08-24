import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
        const img_url = req.query.image_url;
        if (!img_url) {
            return res.status(400).send({message: "img_url is required. please provide valid url"});
        } else {
            filterImageFromURL(img_url).then(path => {
                res.status(200).sendFile(path, error => {
                    deleteLocalFiles([path]);
                })
            }).catch(error => {
                res.status(400).send({message: 'img_url is required. please provide valid url'})
            });
        }
    });

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();