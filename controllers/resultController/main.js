const {
  writeToPassDirection,
  writeToPassScaleDirection,
  writeToPassScale,
} = require("../../models/db");
const { getPassScaleObjects } = require("./passScaleCount");
const { getPassScaleDirectionObjects } = require("./passScaleDirectionCount");
const { getPassDirectionObjects } = require("./passDirectionCount");

function countResult(formData, test_id, pass_id) {
  return new Promise((res, rej) => {
    getPassScaleObjects(formData, pass_id, test_id)
      .then((passScaleObjects) => {
        writeToPassScale(passScaleObjects);
        return getPassScaleDirectionObjects(passScaleObjects, pass_id, test_id);
      })
      .then((passScaleDirectionObjects) => {
        writeToPassScaleDirection(passScaleDirectionObjects);
        return getPassDirectionObjects(passScaleDirectionObjects, pass_id);
      })
      .then(async (passDirectionObjects) => {
        await writeToPassDirection(passDirectionObjects);
      })
      .then(res)
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });
}

module.exports = { countResult };
