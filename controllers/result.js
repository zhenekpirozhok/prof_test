const db = require("../models/db");

function countScaleAvg(formData, test_id) {
  return new Promise((resolve, reject) => {
    db.getQuestionsFromDB(test_id)
      .then((questions) => {
        const questionsPerScale = {};
        const scaleSums = {};
        const scaleAVG = {};

        questions.forEach((question) => {
          scaleSums[question.scale_id]
            ? (scaleSums[question.scale_id] += +formData[question.question_id])
            : (scaleSums[question.scale_id] = +formData[question.question_id]);

          questionsPerScale[question.scale_id]
            ? (questionsPerScale[question.scale_id] += 1)
            : (questionsPerScale[question.scale_id] = 1);
        });

        for (const key in scaleSums) {
          if (Object.hasOwnProperty.call(scaleSums, key)) {
            scaleAVG[key] = scaleSums[key] / questionsPerScale[key];
            scaleAVG[key] = +scaleAVG[key].toFixed(2);
          }
        }

        resolve(scaleAVG);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function countPassAprobationRatio(scaleAvgData, test_id) {
  return new Promise((res, rej) => {
    db.getAprobations(test_id)
      .then((aprobations) => {
        res(
          aprobations.map((apr) => ({
            scale_id: apr.scale_id,
            direction_id: apr.direction_id,
            percent_match:
              scaleAvgData[apr.scale_id] < apr.aprobation_avg
                ? +(scaleAvgData[apr.scale_id] / apr.aprobation_avg).toFixed(2)
                : 1,
          }))
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  countScaleAvg: countScaleAvg,
  countPassAprobationRatio: countPassAprobationRatio,
};
