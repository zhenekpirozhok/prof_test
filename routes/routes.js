import { Router } from "express";
const router = Router();
import { registerPass } from "../models/db";
import { countResult } from "../controllers/result";
import { v4 as uuidv4 } from "uuid";

import { getQuestionsList } from "../controllers/questionsList";

router.get("/", (req, res) => {
  res.render("user");
});

router.get("/getName", (req, res) => {
  req.session.userName = req.query.name;
  req.session.startTime = new Date();

  res.redirect("/it-prof-test");
});

router.get("/it-prof-test", (req, res) => {
  getQuestionsList(1)
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
    1,
    req.session.name,
    linkGuid,
    req.session.startTime,
    req.session.endTime
  )
    .then(countResult(formData, 1))
    .then(res.redirect("/result" + linkGuid))
    .catch(console.log);
});

router.get("/result/:linkGuid", (req, res) => {
  const directions = req.session.directions;
  res.render("result", { directions });
});

export default router;
