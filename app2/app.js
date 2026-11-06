const express = require("express");
const redis = require("redis");

const app = express();

const client = redis.createClient({
  url: "redis://redis:6379"
});

client.on("error", console.error);

app.get("/", async (req, res) => {
  try {
    const totalMessages = await client.lLen("messages");
    const totalVisits = (await client.get("visits")) || 0;

    res.send(`
      <html>
      <head>
        <title>DevOpsHub Dashboard</title>
        <style>
          body { font-family: Arial; background: #f4f6f8; text-align: center; padding: 60px 20px; }
          h1, a { color: #2563eb; }
          .card { display: inline-block; background: white; padding: 30px; margin: 10px; border-radius: 12px; box-shadow: 0 2px 8px #ddd; }
          .number { font-size: 48px; font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>DevOpsHub Dashboard</h1>

        <div class="card">
          <div class="number">${totalMessages}</div>
          <p>Total Messages</p>
        </div>

        <div class="card">
          <div class="number">${totalVisits}</div>
          <p>Total Visits</p>
        </div>

        <p><a href="/">Refresh</a></p>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Could not load the dashboard.");
  }
});

async function start() {
  await client.connect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("App 2 running on port 3000");
  });
}

start().catch(console.error);