const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;


const url = "mongodb://127.0.0.1:27017"; 
const dbName = "task1";

// Middleware
app.use(express.json());

let db, messages;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        messages = db.collection("messages");

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

// GET: data of message
app.get('/messages/:messagesId', async (req, res) => {
    try {
        const to = req.params.messagesId;
        const allmessages = await messages.findOne({to});
        res.status(200).json(allmessages);
    } catch (err) {
        res.status(500).send("Error fetching messages: " + err.message);
    }
});


// POST: Add a new message
app.post('/messages', async (req, res) => {
    try {
        const { sentAt, ...post } = req.body;
        const newmessages = {...post,sentAt: new Date(sentAt),};
        const result = await messages.insertOne(newmessages);
        res.status(201).send(`messages added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding messages: " + err.message);
    }
});



// DELETE: Remove a message
app.delete('/messages/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const result = await messages.deleteOne({ messageId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting messages: " + err.message);
    }
});