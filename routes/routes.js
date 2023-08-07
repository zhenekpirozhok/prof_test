const express = require("express");
const router = express.Router();
const db = require("../models/db");
const resultCounter = require("../controllers/result");

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

router.post('/submit', (req, res) => {
  const formData = req.body;
  console.log(formData);
  const avg = resultCounter.countScaleAvg(formData, 1);
  console.log('scale avg:', avg);
  const aprRatios = resultCounter.countPassAprobationRatio(avg, 1);
  console.log('aprobation ratios:');
  aprRatios.forEach(element => {
    console.log(element);
  });
  res.redirect('/result');
});

router.get('/result', (req, res) => {
  res.send('Your result is counting...');
});


module.exports = router;
