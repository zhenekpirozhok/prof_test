const db = require("../models/db");

function getQuestionsList(test_id) {
  return db
    .getQuestionsFromDB(test_id)
    .then((questions) => {
      const promises = questions.map(question => {
        return db
          .getQuestionOptions(question.question_id)
          .then((options) => {
            question.options = options;
            return question;
          })
          .catch((err) => {
            console.log(`Ошибка при подключении к базе данных: ${err}`);
            return question; // Preserve the question even if an error occurs
          });
      });

      return Promise.all(promises);
    })
    .catch((err) => {
      console.log(`Ошибка при подключении к базе данных: ${err}`);
      return []; // Return an empty array if there's an error
    });
}

module.exports = {
  getQuestionsList: getQuestionsList,
};
