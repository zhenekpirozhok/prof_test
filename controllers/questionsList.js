const db = require("../models/db");

function getQuestionsList(test_id) {
  const questionsPromise = db.getQuestionsFromDB(test_id);
  const optionsPromise = db.getOptionsFromDB(test_id);

  return Promise.all([questionsPromise, optionsPromise])
    .then(([questions, options]) => {
      const questionsList = questions.map((question) => {
        const questionOptions = options
          .filter((option) => (option.question_id === question.question_id))
          .sort((a, b) => {
            return a.option_position - b.option_position;
          });
        question.options = questionOptions;
        return question;
      });

      return questionsList;
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err; // Re-throw the error to be caught by the caller or handle it further
    });
}

module.exports = {
  getQuestionsList: getQuestionsList,
};
