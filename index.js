const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.REACT_USER}:${process.env.REACT_PASS}@cluster0.u8ama.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// BikeZone
// MvJMHz7V3bnrCmg0

async function run() {
    try {
      await client.connect();
      const database = client.db("BikeZone");
      const productCollection = database.collection("Products");
      const orderCollection = database.collection("Orders");
      const userCollection = database.collection("Users");
      const reviewCollection = database.collection("Reviews");

      // Get Single Product by Id
      app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.findOne(query);
          res.send(result);
      })
      
      // Get All Products
      app.get('/products', async (req, res) => {
          const result = await productCollection.find({}).toArray();
          res.send(result);
      })

      //Post Product
      app.post('/products', async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
      }) 

      // Delete Product by ID
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      })

      // Update Product By Id
      app.put('/products', async (req, res) => {
        const product = req.body;
        const query = { _id: ObjectId(product?._id) };
        const updateDoc = { $set:{
              'displacement': product?.displacement,  
              'engine': product?.engine,  
              'cylinders': product?.cylinders,  
              'milage': product?.milage,  
              'max_torque': product?.max_torque,  
              'max_power': product?.max_power,  
              'emission': product?.emission,  
              'gear': product?.gear,  
              'price': product?.price,  
              'img': product?.img,  
              'fuel_capacity': product?.fuel_capacity,  
              'title': product?.title,  
        } };
        const option = { upsert: true };
        const result = await productCollection.updateOne(query, updateDoc, option);
        res.send(result)
      })

      // Post Customer Order
      app.post('/orders', async (req, res) => {
        const customerOrder = req.body;
        // customerOrder.orderDate = customerOrder.createAt; 
        const result = await orderCollection.insertOne(customerOrder);
        res.send(result);
      })

      // Post Customer Review
      app.post('/reviews', async (req, res) => {
        const review = req.body;
        console.log(review);
        // customerOrder.orderDate = customerOrder.createAt; 
        const result = await reviewCollection.insertOne(review);
        res.send(result);
      })

      // Get Review By Email
      app.get('/reviews', async (req, res) => {
        const query = req.query;
        const result = await reviewCollection.find(query).toArray();
        res.send(result);
      })

      // Post user
      app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
      })

      // Update user
      app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email }
        const updateDoc = { $set: user }
        const option = { upsert: true }
        const result = await userCollection.updateOne(filter, updateDoc, option);
        res.send(result);
      })

      // Get All Orders
      app.get('/orders', async (req, res) => {
        const result = await orderCollection.find({}).toArray();
        res.send(result);
      })

      // Get Orders by Email
      app.get('/orders/:email', async (req, res) => {
        const email = req.params.email;
        const query = { customerEmail: email };
        const result = await orderCollection.find(query).toArray();
        res.send(result)
      })

      // Delete Order By Id
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.send(result);
      })

      // Update Order Status
      app.put('/orders/shipping/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const updateDoc = { $set:{ orderStatus: "Shipped" } }
        const result = await orderCollection.updateOne(query, updateDoc);
        res.send(result)
      })

      // Make a user Admin
      app.put('/users/admin/:email', async (req, res) => {
        const query = req.params;
        const updateDoc = { $set:{ role: "Admin" } }
        const result = await userCollection.updateOne(query, updateDoc);
        res.send(result)
      })

      //Get All Admins
      app.get('/users/admin', async(req, res) => {
        const query = {role: "Admin"};
        const result = await userCollection.find(query).toArray();
        res.send(result);
      })

      // Get Admin Info By Email
      app.get('/users', async (req, res) => {
        const query = req.query;
        let isAdmin = false
        const user = await userCollection.findOne(query);
        console.log(user);
        if(user?.role === 'Admin'){
          isAdmin = true;
        }
        res.send({"admin": isAdmin});
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('BikeZone Back End is Running');
})

app.listen(port, () => {
    console.log("Listening to", port);
})