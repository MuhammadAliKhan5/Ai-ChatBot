let express = require("express");
let cors = require("cors");
let { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

let App = express();
App.use(
  cors({
    origin: "http://localhost:5173", 
  })
);
App.use(express.json());

console.log("Loaded PORT =", process.env.PORT);
console.log("API KEY loaded =", process.env.API_KEY ? "YES" : "NO");

let genAi = new GoogleGenerativeAI(process.env.API_KEY);
let model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

App.post("/ask", async (req, res) => {
  try {
    let { question } = req.body;

    if (!question) {
      return res.send({
        _status: false,
        _message: "Question is required",
      });
    }

    let data = await model.generateContent(question);
    let finalData = data.response.text();

    res.send({
      _status: true,
      _message: "Content Found",
      finalData,
    });
  } catch (err) {
    console.log(err);
    res.send({
      _status: false,
      _message: "Error generating content",
      error: err.message,
    });
  }
});

App.listen(process.env.PORT, () => {
  console.log("Server started on port", process.env.PORT);
});
