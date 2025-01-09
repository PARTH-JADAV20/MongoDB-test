const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;


const url = "mongodb://127.0.0.1:27017"; 
const dbName = "task1";

// Middleware
app.use(express.json());

let db, connections;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        connections = db.collection("connections");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes


// GET: data of connection
app.get('/connections/:userId', async (req, res) => {
    try {
        const user1 = req.params.userId;
        const allconnections = await connections.findOne({user1});
        res.status(200).json(allconnections);
    } catch (err) {
        res.status(500).send("Error fetching connections: " + err.message);
    }
});


// POST: Add a new connection
app.post('/connections', async (req, res) => {
    try {
        
        const newconnections = req.body;
        const result = await connections.insertOne(newconnections);
        res.status(201).send(`connections added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding connections: " + err.message);
    }
});

// PATCH: Partially update a connection
app.patch('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId;
        const updates = req.body;
        const result = await connections.updateOne({ connectionId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating connections: " + err.message);
    }
});

// DELETE: Remove a connection
app.delete('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId;
        const result = await connections.deleteOne({ connectionId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting connections: " + err.message);
    }
});