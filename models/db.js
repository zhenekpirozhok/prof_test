const mysql = require("mysql2/promise");
const dbConfig = require("./db-config");
const pool = mysql.createPool(dbConfig);

async function getQuestionsFromDB(test_id) {
  const dbResponse = await pool.query(
    `SELECT * FROM test_question WHERE test_id=?;`,
    [test_id]
  );
  return dbResponse[0];
}

async function getOptionsFromDB(test_id) {
  const dbResponse = await pool.query(
    `SELECT * FROM question_response WHERE question_id IN (SELECT question_id FROM test_question WHERE test_id=${mysql.escape(
      test_id
    )});`
  );
  return dbResponse[0];
}

async function getQuestionOptions(question_id) {
  const dbResponse = await pool.query(
    `SELECT * FROM question_response WHERE question_id=?;`,
    [question_id]
  );
  return dbResponse[0];
}

async function getAprobations(test_id) {
  const dbResponse = await pool.query(
    `SELECT * FROM scale_direction WHERE test_id=?;`,
    [test_id]
  );
  return dbResponse[0];
}

async function registerPass(
  test_id,
  name,
  link_guid,
  timestamp_begin,
  timestamp_end
) {
  const query = `
    INSERT INTO test_pass 
      (test_id, name, link_guid, timestamp_begin, timestamp_end) 
    VALUES 
      (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(query, [
      test_id,
      name,
      link_guid,
      timestamp_begin,
      timestamp_end,
    ]);

    return result.insertId;
  } catch (error) {
    console.log("Error inserting data to db: ", error);
  }
}

async function writeToPassScale(dataArray) {
  try {
    const valuesToInsert = dataArray.map((element) => Object.values(element));
    const query = `INSERT INTO test_pass_scale 
    (pass_id, scale_id, sum, average) 
    VALUES ?`;
    await pool.query(query, [valuesToInsert]);
  } catch (error) {
    console.log("Error inserting data to db: ", error);
  }
}

// Later I need to think about what's to put in text match
async function writeToPassScaleDirection(dataArray) {
  try {
    const valuesToInsert = dataArray.map((element) => Object.values(element).slice(0, 4));
    const query = `INSERT INTO test_pass_scale_direction 
    (pass_id, scale_id, direction_id, percent_match) 
    VALUES ?`;
    await pool.query(query, [valuesToInsert]);
  } catch (error) {
    console.log("Error inserting data to db: ", error);
  }
}

async function writeToPassDirection(dataArray) {
  try {
    const valuesToInsert = dataArray.map((element) => Object.values(element));
    const query = `INSERT INTO test_pass_direction 
    (pass_id, direction_id, percent_match) 
    VALUES ?`;
    await pool.query(query, [valuesToInsert]);
  } catch (error) {
    console.log("Error inserting data to db: ", error);
  }
}

async function getTestIdByLink(link_name) {
  const dbResponse = await pool.query(
    `SELECT test_id FROM test WHERE link_name=?;`,
    [link_name]
  );

  if (dbResponse[0].length === 0) {
    throw new Error("Test not found"); // Throw an error if no test is found
  }

  return dbResponse[0];
}

async function getTests() {
  const dbResponse = await pool.query(`SELECT * FROM test;`);

  return dbResponse[0];
}

async function getTestResult(link_guid) {
  const query = `
  SELECT test_pass_direction.percent_match, direction.direction_name, pass_id
  FROM test_pass_direction 
  INNER JOIN direction
  ON test_pass_direction.direction_id = direction.direction_id
  HAVING pass_id = (
    SELECT pass_id 
    FROM test_pass
    WHERE link_guid = ?
  );
  `;

  const dbResponse = await pool.query(
    query,
    [link_guid]
  );

  if (dbResponse[0].length === 0) {
    throw new Error("Link not found"); 
  }

  return dbResponse[0];
}

async function getUserFromPass(link_guid) {
  const query = 
  `
  SELECT name FROM test_pass
  WHERE link_guid = ?;
  `;
  const dbResponse = await pool.query(query, link_guid);

  return dbResponse[0];
}

module.exports = {
  getQuestionsFromDB: getQuestionsFromDB,
  getQuestionOptions: getQuestionOptions,
  getOptionsFromDB: getOptionsFromDB,
  getAprobations: getAprobations,
  registerPass: registerPass,
  writeToPassScale: writeToPassScale,
  writeToPassScaleDirection: writeToPassScaleDirection,
  writeToPassDirection: writeToPassDirection,
  getTestIdByLink: getTestIdByLink,
  getTests: getTests,
  getTestResult: getTestResult,
  getUserFromPass: getUserFromPass
};
