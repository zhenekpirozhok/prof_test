function dateToTimeStamp(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
}

module.exports = {
  dateToTimeStamp,
};
