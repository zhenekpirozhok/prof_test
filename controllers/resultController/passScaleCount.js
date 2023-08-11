const { PassScale } = require("./passInstances");
const { getQuestionsFromDB } = require("../../models/db");

function calculateScaleSumsAndCounts(questions, formData) {
  const questionsPerScale = {};
  const scaleSums = {};

  questions.forEach((question) => {
    scaleSums[question.scale_id]
      ? (scaleSums[question.scale_id] += +formData[question.question_id])
      : (scaleSums[question.scale_id] = +formData[question.question_id]);

    questionsPerScale[question.scale_id]
      ? (questionsPerScale[question.scale_id] += 1)
      : (questionsPerScale[question.scale_id] = 1);
  });

  return { scaleSums, questionsPerScale };
}

function calculateScaleAverages(scaleSums, questionsPerScale, pass_id) {
  const scaleAVG = [];

  for (const key in scaleSums) {
    if (Object.hasOwnProperty.call(scaleSums, key)) {
      scaleAVG.push(
        new PassScale(
          pass_id,
          key,
          scaleSums[key],
          (scaleSums[key] / questionsPerScale[key]).toFixed(2)
        )
      );
    }
  }

  return scaleAVG;
}

function countScaleAvg(questions, formData, pass_id) {
  const { scaleSums, questionsPerScale } = calculateScaleSumsAndCounts(
    questions,
    formData
  );

  const scaleAVG = calculateScaleAverages(
    scaleSums,
    questionsPerScale,
    pass_id
  );

  return scaleAVG;
}

function getPassScaleObjects(formData, pass_id, test_id) {
  return new Promise((res, rej) => {
    getQuestionsFromDB(test_id)
      .then((questions) => {
        res(countScaleAvg(questions, formData, pass_id));
      })
      .catch(rej);
  });
}

module.exports = { getPassScaleObjects };
