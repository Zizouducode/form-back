//Imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const formData = require("form-data");
const Mailgun = require("mailgun.js");

//Create server
const app = express();

//Enable request from browser
app.use(cors());

//Enable json data
app.use(express.json());

//Mailgun config
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

//Create routes

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);

    //Create object messageDate to sent to Mailgun

    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: "hamga.karim@gmail.com",
      subject: `${req.body.subject}`,
      text: req.body.message,
    };

    //Create email and send it with Mailgun

    const result = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(400).json({ error: "This route does not exists" });
});

//Start server
app.listen(process.env.PORT, () => {
  console.log("Server start");
});
