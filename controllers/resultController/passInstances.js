class PassScale {
  constructor(pass_id, scale_id, sum, average) {
    this.pass_id = +pass_id;
    this.scale_id = +scale_id;
    this.sum = +sum;
    this.average = +average;
  }
}

class PassScaleDirection {
  constructor(pass_id, scale_id, direction_id, percent_match) {
    this.pass_id = +pass_id;
    this.scale_id = +scale_id;
    this.direction_id = +direction_id;
    this.percent_match = +percent_match;
  }
}

class PassDirection {
  constructor(pass_id, direction_id, percent_match) {
    this.pass_id = +pass_id;
    this.direction_id = +direction_id;
    this.percent_match = +percent_match;
  }
}

module.exports = {
  PassDirection,
  PassScale,
  PassScaleDirection,
};
