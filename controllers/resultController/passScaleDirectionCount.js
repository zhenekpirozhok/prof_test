const { PassScaleDirection } = require("./passInstances");
const { getAprobations } = require("../../models/db");

// Function to calculate the aprobation ratio for a single scale
function calculateAprobationRatio(scaleAvgData, aprobation, pass_id) {
  const scaleId = aprobation.scale_id;
  const aprobationAvg = aprobation.aprobation_avg;
  const matchingPassScale = scaleAvgData.find((elem) => elem.scale_id == scaleId);

  const percentMatch =
  matchingPassScale.average < aprobationAvg
      ? +(matchingPassScale.average / aprobationAvg).toFixed(2)
      : 1;   

  return new PassScaleDirection(
    pass_id,
    scaleId,
    aprobation.direction_id,
    percentMatch,
    aprobation.weight
  );
}

// Function to calculate the aprobation ratios for all scales
function calculatePassAprobationRatios(scaleAvgData, pass_id, aprobations) {
  const aprobationRatios = aprobations.map((aprobation) => {
    return calculateAprobationRatio(scaleAvgData, aprobation, pass_id);
  });

  return aprobationRatios;
}

function getPassScaleDirectionObjects(scaleAvgData, pass_id, test_id) {
  return new Promise((res, rej) => {
    getAprobations(test_id)
      .then((aprobations) => {
        res(calculatePassAprobationRatios(scaleAvgData, pass_id, aprobations));
      })
      .catch(rej);
  });
}

module.exports = {
  getPassScaleDirectionObjects,
};
