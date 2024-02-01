const { MongoClient } = require("mongodb");
const express = require('express')
const app = express()
const port = 3000

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'cellar';
const collection = 'wines';

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.get('/wines', (req, res) => {
    console.log(req.query)
    async function run() {
        try {
            await client.connect();                             //console.log(client); 
            const database = client.db(dbName);                 //console.log(database);
            const colWines = database.collection(collection);   //console.log(colWines);
            let query = {};
            let options = {
                sort:{},
                projection: { _id: 0, id: 1, name: 1, year: 1, country: 1 },
            };

            if(req.query) {
                query[req.query.key] = req.query.val;
                options.sort[req.query.sort] = 1;
            }
            //console.log(query);
            //console.log(options);

            const cursor = await colWines.find(query, options);               //console.log(cursor);
            const wines = await cursor.toArray();

            res.json(wines)
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);   
});

app.get('/wines/:id(\\d+)', (req, res) => {
    //console.log(req.params.id)
    async function run() {
        try {
            await client.connect();//console.log(client); 
            const database = client.db(dbName);                 //console.log(database);
            const colWines = database.collection(collection);   //console.log(colWines);
            
            // Requête pour le vin dont l'id est passé en paramètre d'URL
            const query = { id: req.params.id };
            const cursor = await colWines.find(query);               //console.log(cursor);
            const wines = await cursor.toArray();

            res.json(wines)
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);   
});

app.post('/wines/:id(\\d+)/comments', (req, res) => {
    res.send('POST new comment')
});

app.put('/wines/:id(\\d+)/comments/:commentId', (req, res) => {
    res.send('PUT comment by id')
});

app.delete('/wines/:id(\\d+)/comments/:commentId', (req, res) => {
    res.send('DELETE comment by id')
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});