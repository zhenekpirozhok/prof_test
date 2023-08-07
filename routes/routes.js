const express = require("express");
const router = express.Router();
const db = require("../models/db");
const resultCounter = require("../controllers/result");

const questionsList = require("../controllers/questionsList");

router.get("/", (req, res) => {
  questionsList
    .getQuestionsList(1)
    .then((result) => {
      res.render("index", {
        questions: result,
      });
    })
    .catch((err) => {
      console.log(`Ошибка при подключении к базе данных: ${err}`);
    });
});

router.post("/submit", (req, res) => {
  const formData = req.body;

  resultCounter.countResult(formData, 1).then(directions => {
    res.send(`
Ваш результат:\n
Business Analysis - ${(directions["1"]*100).toFixed(0)}%
Data Engineering - ${(directions["2"]*100).toFixed(0)}%
Development - ${(directions["3"]*100).toFixed(0)}%
Testing - ${(directions["4"]*100).toFixed(0)}%
    `);
  }).catch(console.log);
});

router.get("/result", (req, res) => {
  res.send("Your result is counting...");
});

module.exports = router;
