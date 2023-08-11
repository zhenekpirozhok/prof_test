const { PassDirection } = require("./passInstances");

function calculateDirectionWeights(aprobationRatios) {
  const directionWeights = aprobationRatios.reduce((acc, current) => {
    acc[current.direction_id] =
      (acc[current.direction_id] || 0) + current.weight;
    return acc;
  }, {});

  return directionWeights;
}

function calculateDirectionObject(aprobationRatios) {
  const directionObject = aprobationRatios.reduce((acc, current) => {
    acc[current.direction_id] =
      (acc[current.direction_id] || 0) + current.percent_match * current.weight;
    return acc;
  }, {});

  return directionObject;
}

function calculateFinalDirectionMatches(
  directionObject,
  directionWeights,
  pass_id
) {
  const finalDirectionMatches = [];

  console.log('Direction object: ', directionObject);
  console.log('Direction weights: ', directionWeights);

  for (const key in directionObject) {
    if (Object.hasOwnProperty.call(directionObject, key)) {
      finalDirectionMatches.push(
        new PassDirection(
          pass_id,
          key,
          +(directionObject[key] / directionWeights[key]).toFixed(2)
        )
      );
    }
  }

  return finalDirectionMatches;
}

function getDirectionMatches(aprobationRatios, pass_id) {
  const directionWeights = calculateDirectionWeights(aprobationRatios);
  const directionObject = calculateDirectionObject(aprobationRatios);
  const finalDirectionMatches = calculateFinalDirectionMatches(
    directionObject,
    directionWeights,
    pass_id
  );

  return finalDirectionMatches;
}

function getPassDirectionObjects(aprobationRatios, pass_id) {
  return new Promise((res, rej) => {
    try {
      const passDirectionObjects = getDirectionMatches(aprobationRatios, pass_id);
      res(passDirectionObjects);
    }
    catch(err) {
      console.log(err);
      rej(err);
    }
  });
}

module.exports = { getPassDirectionObjects };
