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

  resultCounter
    .countResult(formData, 1)
    .then((directions) => {
      req.session.directions = directions;
      res.redirect("/result");
    })
    .catch(console.log);
});

router.get("/result", (req, res) => {
  const directions = req.session.directions;
  res.render("result", { directions });
});

module.exports = router;
