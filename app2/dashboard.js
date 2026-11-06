const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

// الاتصال بـ Redis عن طريق اسم الخدمة "redis"
const client = redis.createClient({
  url: "redis://redis:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect();

app.get("/", async (req, res) => {
  try {
    const totalMessages = await client.lLen("messages"); // عدد الرسائل
    const totalVisits = (await client.get("visits")) || 0; // عدد الزيارات

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DevOpsHub Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 60px; background: #f4f4f4; }
          .card { display: inline-block; background: white; padding: 30px 50px; margin: 15px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
          .number { font-size: 48px; font-weight: bold; color: #2c7be5; }
        </style>
      </head>
      <body>
        <h1>DevOpsHub Dashboard</h1>
        <div class="card">
          <div class="number">${totalMessages}</div>
          <div>Total Messages</div>
        </div>
        <div class="card">
          <div class="number">${totalVisits}</div>
          <div>Total Visits</div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error connecting to Redis: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Dashboard listening on port ${port}`);
});