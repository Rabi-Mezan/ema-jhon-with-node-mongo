const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


//user:emaJhon
//pass:fAo23sFxZMr2xepf

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);



async function run() {

    try {

        await client.connect()

        const database = client.db("ema_Jhon_Shop")
        const productsCollection = database.collection("products");
        const orderCollection = database.collection("orders");


        app.get('/products', async (req, res) => {
            const page = req.query.page
            const cursor = productsCollection.find({})
            const products = await cursor.toArray()
            const count = await cursor.count();
            res.send({
                count,
                products
            });
        })

        // add order api
        app.post('/orders', async (req, res) => {
            const orders = req.body
            const result = await orderCollection.insertOne(orders)
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Hello, miavai from the server")
})

app.listen(port, () => {
    console.log("server is running on port ", port);
})

