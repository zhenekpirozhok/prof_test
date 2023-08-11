const express = require("express");
const router = express.Router();
const { registerPass, getTestIdByLink } = require("../models/db");
const { countResult } = require("../controllers/resultController/main");
const { v4: uuidv4 } = require("uuid");

const { getQuestionsList } = require("../controllers/questionsList");

router.get("/favicon.ico", (req, res) => {
  // Send favicon.ico file here
});

router.get("/getUserInfo", (req, res) => {
  req.session.userName = req.query.name;
  req.session.startTime = new Date();

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

router.post("/submit", (req, res) => {
  const formData = req.body;
  req.session.endTime = new Date();
  const linkGuid = uuidv4();

  registerPass(
    req.session.test_id,
    req.session.name,
    linkGuid,
    req.session.startTime,
    req.session.endTime
  )
    .then((pass_id) => countResult(formData, req.session.test_id, pass_id))
    .then(res.redirect("/result/" + linkGuid))
    .catch(console.log);
});

router.get("/result/:linkGuid", (req, res) => {
  const directions = req.session.directions;
  res.render("result", { directions });
});

module.exports = router;
