const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5030;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.082e3cj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const brandNameCollection = client.db("brandDB").collection("brand");
    const brandProductsCollection = client.db("brandDB").collection("Products");

    const userCollection = client.db("brandDB").collection("user");

    const userCollectionData = client.db("brandDB").collection("userData");

    // Banner data
    app.post("/brands", async (req, res) => {
      const brandName = req.body;
      const result = await brandNameCollection.insertOne(brandName);
      res.send(result);
    });

    app.get("/brands", async (req, res) => {
      const cursor = brandNameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const bandData = await brandNameCollection.findOne(query);
      const result = await brandProductsCollection
        .find({ bandName: bandData.bandName })
        .toArray();

      res.send(result);
    });

    // Band Data
    app.post("/products", async (req, res) => {
      const bandProduct = req.body;
      console.log(bandProduct);
      const result = await brandProductsCollection.insertOne(bandProduct);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = brandProductsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // details
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandProductsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //update
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateData = req.body;
      const options = { upsert: true };
      const product = {
        $set: {
          name: updateData.name,
          image: updateData.image,
          bandName: updateData.bandName,
          category: updateData.category,
          price: updateData.price,
          rating: updateData.rating,
          description: updateData.description,
        },
      };
      const result = await brandProductsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    //user related api
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });






//kjshsjyegoa
//gashbdfhr




    // user dataCollection
    app.post("/userData", async (req, res) => {
      const user = req.body;
      const result = await userCollectionData.insertOne(user);
      res.send(result);
    });

    // user data added
    app.get("/userData/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const result = await userCollectionData.find({ email: email }).toArray();
      res.send(result);
    });

    // user data deleted
    app.delete("/userData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollectionData.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Technology making server is running");
});

app.listen(port, () => {
  console.log(`Technology server is running PORT: ${port}`);
});
