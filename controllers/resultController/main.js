const db = require("../../models/db");
const { getPassScaleObjects } = require("./passScaleCount");
const { getPassScaleDirectionObjects } = require("./passScaleDirectionCount");
const { getPassDirectionObjects } = require("./passDirectionCount");

// function countResult(formData, test_id, pass_id) {
//   return new Promise((res, rej) => {
//     getPassScaleObjects(formData, pass_id, test_id)
//       .then((passScaleObjects) => {
//         db.writeToPassScale(passScaleObjects);
//         return getPassScaleDirectionObjects(passScaleObjects, pass_id, test_id);
//       })
//       .then((passScaleDirectionObjects) => {
//         db.writeToPassScaleDirection(passScaleDirectionObjects);
//         return getPassDirectionObjects(passScaleDirectionObjects, pass_id);
//       })
//       .then((passDirectionObjects) => {
//         db.writeToPassDirection(passDirectionObjects);
//         res(passDirectionObjects);
//       })
//       .catch((err) => {
//         console.log(err);
//         rej(err);
//       });
//   });
// }

function countResult(formData, test_id, pass_id) {
  return new Promise((res, rej) => {
    getPassScaleObjects(formData, pass_id, test_id)
      .then((passScaleObjects) => {
        console.log(passScaleObjects);
        return getPassScaleDirectionObjects(passScaleObjects, pass_id, test_id);
      })
      .then((passScaleDirectionObjects) => {
        console.log(passScaleDirectionObjects);
        return getPassDirectionObjects(passScaleDirectionObjects, pass_id);
      })
      .then((passDirectionObjects) => {
        console.log(passDirectionObjects);
        res(passDirectionObjects);
      })
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });
}

module.exports = { countResult };
