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

    // get all data
    app.get('/alltoysdata',async(req,res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

  //  get  sone data
    app.get('/alltoysdata/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query)
      res.send(result)
    })
      // ***************** getb by  email
    app.get('/alltoysdatas',async(req,res)=>{
      console.log(req.query.email)
      let query ={};
      if(req.query?.email){
        query ={sellerEmail: req.query?.email}
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result)
    })

 
     // *****  Post add
    app.post('/alltoysdata',async(req,res)=>{
      const addDatas = req.body;
      console.log(addDatas);
      const result = await toysCollection.insertOne(addDatas);
      res.send(result);
    })

      //***** */ Delete  One
    app.delete('/alltoysdatas/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query)
      res.send(result)
    })

    // Edit  data
    app.put('/alltoysdatas/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const optaion ={ upsert: true}
      const updatetoy =req.body
      const toys={
        $set:{
          Price:updatetoy.Price,
          Available_quantity:updatetoy.Available_quantity,
          Detail_description:updatetoy.Detail_description

        }
      }
      const result = await toysCollection.updateOne(filter,toys,optaion)
      res.send(result)
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

