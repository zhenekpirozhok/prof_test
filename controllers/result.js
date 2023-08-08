const db = require("../models/db");

class PassScale {
  constructor(pass_id, scale_id, sum, average) {
    this.pass_id = pass_id;
    this.scale_id = scale_id;
    this.sum = sum;
    this.average = average;
  }
}

function countScaleAvg(formData, test_id, pass_id) {
  return new Promise((resolve, reject) => {
    db.getQuestionsFromDB(test_id)
      .then((questions) => {
        const questionsPerScale = {};
        const scaleSums = {};
        const scaleAVG = [];

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
            scaleAVG.push(
              new PassScale(
                pass_id,
                key,
                scaleSums[key],
                +(scaleSums[key] / questionsPerScale[key]).toFixed(2)
              )
            );
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
            weight: apr.weight,
          }))
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getDirectionMatches(aprobationRatios) {
  return new Promise((res, rej) => {
    const directionWeights = aprobationRatios.reduce((acc, current) => {
      acc[current.direction_id]
        ? (acc[current.direction_id] += current.weight)
        : (acc[current.direction_id] = current.weight);
      return acc;
    }, {});

    const directionObject = aprobationRatios.reduce((acc, current) => {
      acc[current.direction_id]
        ? (acc[current.direction_id] += current.percent_match * current.weight)
        : (acc[current.direction_id] = current.percent_match * current.weight);
      return acc;
    }, {});

    for (const key in directionObject) {
      if (Object.hasOwnProperty.call(directionObject, key)) {
        directionObject[key] = +(
          directionObject[key] / directionWeights[key]
        ).toFixed(2);
      }
    }

    res(directionObject);
  });
}

function countResult(formData, test_id) {
  return new Promise((res, rej) => {
    countScaleAvg(formData, test_id)
      .then((scaleAvgData) => countPassAprobationRatio(scaleAvgData, test_id))
      .then(getDirectionMatches)
      .then(res)
      .catch(rej);
  });
}

module.exports = {
  countScaleAvg: countScaleAvg,
  countPassAprobationRatio: countPassAprobationRatio,
  getDirectionMatches: getDirectionMatches,
  countResult: countResult,
};
