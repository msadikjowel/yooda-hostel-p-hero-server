const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxr0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected')

        const database = client.db("yoodaHostel");

        // collection
        const foodCollection = database.collection("food")
        const studentCollection = database.collection('students');
        const distributionCollection = database.collection('distributed')

        // GET API (get all food)
        app.get('/allFood', async (req, res) => {
            const result = await foodCollection.find({}).toArray();
            res.json(result);
        });

        // GET API (get all students)
        app.get('/allStudent', async (req, res) => {
            const result = await studentCollection.find({}).toArray();
            res.json(result);
        });
        // GET API (get all distribution list)
        app.get('/distributed', async (req, res) => {
            const result = await distributionCollection.find({}).toArray();
            res.json(result);
        });

        // GET API (get single food)
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.json(result);
        });

        // GET API (get single student)
        app.get('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            res.json(result);
        });

        // GET API (get student for serve)
        app.get('/distribution/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            res.json(result);
        });

        // POST API (add food (admin only))
        app.post('/addFood', async (req, res) => {
            const addFood = req.body;
            const result = await foodCollection.insertOne(addFood);
            res.json(result);
        });

        // POST API (add student (admin only))
        app.post('/addStudent', async (req, res) => {
            const addStudent = req.body;
            const result = await studentCollection.insertOne(addStudent);
            res.json(result);
        });

        // POST API (add distribution (admin only))
        app.post('/distributed', async (req, res) => {
            const distribution = req.body;
            const result = await distributionCollection.insertOne(distribution);
            res.json(result);
        });

        // DELETE API (admin deleting food)
        app.delete('/foodDelete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.json(result)

        });

        // DELETE API (admin deleting student)
        app.delete('/studentDelete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
            res.json(result)

        });

        // UPDATE API (food)
        app.put('/food/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFood = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedFood.name,
                    price: updatedFood.price
                },
            };
            const result = await foodCollection.updateOne(filter, updatedDoc, options)
            res.json(result)
        });

        // UPDATE API (student)
        app.put('/student/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    fullName: updatedStudent.fullName,
                    roll: updatedStudent.roll,
                    age: updatedStudent.age,
                    class: updatedStudent.class,
                    hall: updatedStudent.hall,
                    status: updatedStudent.status,
                },
            };
            const result = await studentCollection.updateOne(filter, updatedDoc, options)
            res.json(result)
        });

        // PUT API (update status)
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateStatus = {
                $set: {
                    status: 'ACTIVE'
                },
            };

            const result = await studentCollection.updateOne(filter, updateStatus, options);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello yooda hostel!')
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})