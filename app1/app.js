const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));

const client = redis.createClient({
  url: "redis://redis:6379"
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

app.get("/", async (req, res) => {
  try {
    await client.incr("visits");

    res.send(`
      <h1>Message Collector</h1>
      <form action="/messages" method="POST">
        <input
          type="text"
          name="message"
          placeholder="Write your message"
          required
        >
        <button type="submit">Send</button>
      </form>
    `);
  } catch (err) {
    res.status(500).send("Could not load the page.");
  }
});

app.post("/messages", async (req, res) => {
  try {
    const message = (req.body.message || "").trim();

    if (!message) {
      return res.status(400).send("Please enter a message.");
    }

    await client.rPush("messages", message);

    res.send(`
      <h1>Message saved!</h1>
      <a href="/">Back to message page</a>
    `);
  } catch (err) {
    res.status(500).send("Could not save the message.");
  }
});

async function start() {
  await client.connect();

  app.listen(port, "0.0.0.0", () => {
    console.log("App 1 listening on port " + port);
  });
}

start().catch(console.error);