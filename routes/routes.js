const express = require("express");
const router = express.Router();
const {
  registerPass,
  getTestIdByLink,
  getTestResult,
  getUserFromPass
} = require("../models/db");
const { countResult } = require("../controllers/resultController/main");
const { v4: uuidv4 } = require("uuid");
const { dateToTimeStamp } = require("../utils/date");

const { getQuestionsList } = require("../controllers/questionsList");

router.get("/favicon.ico", (req, res) => {
  // Send favicon.ico file here
});

router.get("/getUserInfo", (req, res) => {
  req.session.userName = req.query.name;
  req.session.startTime = dateToTimeStamp(new Date());

  res.redirect(`/${req.session.testLink}/test`);
});

router.get("/:testLink", (req, res) => {
  req.session.testLink = req.params.testLink;

  getTestIdByLink(req.session.testLink)
    .then((curTest) => {
      req.session.test_id = curTest[0].test_id;
      res.render("user");
    })
    .catch((error) => {
      res.status(404).send("Test not found");
      console.log(error);
    });
});

router.get("/:testLink/test", (req, res) => {
  getQuestionsList(req.session.test_id)
    .then((result) => {
      res.render("index", {
        questions: result,
      });
    })
    .catch((err) => {
      console.log(`Ошибка при подключении к базе данных: ${err}`);
    });
});

router.post("/submit", async (req, res) => {
  try {
    const formData = req.body;
    req.session.endTime = dateToTimeStamp(new Date());
    const linkGuid = uuidv4();

    const pass_id = await registerPass(
      req.session.test_id,
      req.session.userName,
      linkGuid,
      req.session.startTime,
      req.session.endTime
    );

    await countResult(formData, req.session.test_id, pass_id);

    res.redirect("/result/" + linkGuid);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while processing the request.");
  }
});

router.get("/result/:linkGuid", (req, res) => {
  Promise.all([
    getTestResult(req.params.linkGuid),
    getUserFromPass(req.params.linkGuid)
  ])
    .then(([directions, user]) => {
      directions = directions.sort((a, b) => {return b.percent_match - a.percent_match});
      res.render("result", { directions, name: user[0].name });
    })
    .catch(err => {
      console.log(err);
      res.status(404).send(`Sorry, couldn't find result under link ${req.params.linkGuid} :(`)
    });
});

module.exports = router;
