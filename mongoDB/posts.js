const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;


const url = "mongodb://127.0.0.1:27017"; 
const dbName = "task1";

// Middleware
app.use(express.json());

let db, posts;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        posts = db.collection("posts");

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

// GET: List all posts
app.get('/posts', async (req, res) => {
    try {
        const allposts = await posts.find().toArray();
        res.status(200).json(allposts);
    } catch (err) {
        res.status(500).send("Error fetching posts: " + err.message);
    }
});

// GET: data of post
app.get('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const allposts = await posts.findOne({postId});
        res.status(200).json(allposts);
    } catch (err) {
        res.status(500).send("Error fetching posts: " + err.message);
    }
});


// POST: Add a new post
app.post('/posts', async (req, res) => {
    try {
         // const newposts = req.body;
        const { createdAt, ...post } = req.body;
        const newposts = {...post,createdAt: new Date(createdAt),};
        const result = await posts.insertOne(newposts);
        res.status(201).send(`posts added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding posts: " + err.message);
    }
});

// PATCH: Partially update a post
app.patch('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const updates = req.body;
        const result = await posts.updateOne({ postId }, { $inc: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating posts: " + err.message);
    }
});

// DELETE: Remove a post
app.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await posts.deleteOne({ postId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting posts: " + err.message);
    }
});