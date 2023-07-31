const mysql = require("mysql2");
const dbConfig = require("./db-config");

const connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }

  // SQL query to get the username
  const sqlQuery = "SELECT * FROM subjects;";

  // Execute the query
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      connection.end(); // Close the database connection
      return;
    }

    console.log("Database users:", results);
    connection.end(); // Close the database connection
  });
});
