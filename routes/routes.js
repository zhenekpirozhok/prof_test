const express = require("express");
const router = express.Router();
const db = require("../models/db");

const questionsList = require("../controllers/questionsList");

router.get("/", (req, res) => {
  questionsList.getQuestionsList(1)
    .then((result) => {
      res.render("index", {
        questions: result,
      });
    })
    .catch((err) => {
      console.log(`Ошибка при подключении к базе данных: ${err}`);
    });
});

router.get("/result", (req, res) => {
  res.send("Your result");
});

module.exports = router;
