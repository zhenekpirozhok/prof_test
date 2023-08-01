const express = require("express");
const router = express.Router();
const db = require("../models/question");

router.get("/", (req, res) => {
  db.getQuestionsFromDB()
    .then((result) => {
      res.render('index', {
        questions: result
      });
    })
    .catch(() => {
      console.log('Ошибка при подключении к базе данных');
    }); 
});

router.get("/result", (req, res) => {
  res.send("Your result");
});

module.exports = router;
