const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.urlencoded({ extended: false }));

const client = redis.createClient({
  url: "redis://redis:6379"
});

client.on("error", console.error);

const style = `
  <style>
    body { font-family: Arial; background: #f4f6f8; text-align: center; padding: 60px 20px; }
    h1, a { color: #2563eb; }
    input { padding: 12px; width: 250px; max-width: 80%; border: 1px solid #ccc; border-radius: 8px; }
    button { padding: 12px 20px; background: #2563eb; color: white; border: 0; border-radius: 8px; cursor: pointer; }
    button:hover { background: #1d4ed8; }
  </style>
`;

app.get("/", async (req, res) => {
  try {
    await client.incr("visits");

    res.send(`
      ${style}
      <h1>Message Collector</h1>
      <form action="/messages" method="POST">
        <input name="message" placeholder="Write your message" required>
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
      ${style}
      <h1>Message saved!</h1>
      <a href="/">Back to message page</a>
    `);
  } catch (err) {
    res.status(500).send("Could not save the message.");
  }
});

async function start() {
  await client.connect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("App 1 running on port 3000");
  });
}

start().catch(console.error);