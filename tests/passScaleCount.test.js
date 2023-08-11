const {
  countScaleAvg,
} = require("../controllers/resultController/passScaleCount");

test("Based on received answers should count the average point for each scale", () => {
  expect(
    countScaleAvg({
      1: "2",
      2: "1",
      3: "3",
      4: "2",
      5: "0",
      6: "2",
      7: "0",
      8: "1",
      9: "1",
      10: "3",
      11: "2",
      12: "0",
      13: "1",
      14: "0",
      15: "2",
      16: "3",
      17: "2",
      18: "3",
      19: "1",
      20: "3",
      21: "1",
      22: "1",
      23: "3",
      24: "3",
    })
  ).toBe([
    {
      pass_id: undefined,
      scale_id: 1,
      sum: 11,
      average: 1.57,
    },
    {
      pass_id: undefined,
      scale_id: 2,
      sum: 9,
      average: 1.29,
    },
    { pass_id: undefined, scale_id: 3, sum: 12, average: 2 },
    { pass_id: undefined, scale_id: 4, sum: 8, average: 2 },
  ]);
});
