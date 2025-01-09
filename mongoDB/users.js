const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;


const url = "mongodb://127.0.0.1:27017"; 
const dbName = "task1";

// Middleware
app.use(express.json());

let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

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

// GET: List all users
app.get('/users', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// GET: data of user
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const allusers = await users.findOne({userId});
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});


// POST: Add a new user
app.post('/users', async (req, res) => {
    try {
        
        const newusers = req.body;
        const result = await users.insertOne(newusers);
        res.status(201).send(`users added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding users: " + err.message);
    }
});

// PATCH: Partially update a users
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        const result = await users.updateOne({ userId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating users: " + err.message);
    }
});

// DELETE: Remove a users
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await users.deleteOne({ userId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting users: " + err.message);
    }
});


//Miscellaneous

//Fetch profile views count
app.get('/users/:userId/profile-views', async (req, res) => {
    try {
        const userId = req.params.userId;
        const profileViews = await users.findOne({ userId },{ projection: { profileViews: 1 }});
        res.status(200).json(profileViews);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});


//Add a skill to a user
app.put('/users/:userId/skills', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateduser = req.body;
        const result = await users.updateOne({ userId }, {$push: updateduser});
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating connections: " + err.message);
    }
});

//Upgrade to premium account
app.patch('/users/:userId/premium', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        const result = await users.updateOne({ userId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating users: " + err.message);
    }
});