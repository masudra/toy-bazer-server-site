const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =express();
const port = process.env.PORT ||5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xyvppop.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const  toysCollection = client.db('toyBazar').collection('allToysData');

    app.get('/alltoysdata',async(req,res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get('/alltoysdata/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    app.post('/alltoysdata',async(req,res)=>{
      const addDatas = req.body;
      console.log(addDatas);
      const result = await toysCollection.insertOne(addDatas);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hello world')

})

app.listen(port,()=>{
    console.log(`port is running on${port}`)
})

