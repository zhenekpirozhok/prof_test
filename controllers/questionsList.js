const db = require("../models/db");

async function getQuestionsList(test_id) {
  try {
    const [questions, options] = await Promise.all([
      db.getQuestionsFromDB(test_id),
      db.getOptionsFromDB(test_id),
    ]);

    return questions.map((question) => {
      question.options = getQuestionOptions(options, question.question_id);
      return question;
    });
  } catch (err) {
    console.error("Error:", err);
    throw err; // Re-throw the error to be caught by the caller or handle it further
  }
}


function getQuestionOptions(optionsData, question_id) {
  return optionsData
  .filter((option) => (option.question_id === question_id))
  .sort((a, b) => {
    return a.option_position - b.option_position;
  });
}

module.exports = {
  getQuestionsList: getQuestionsList,
};
