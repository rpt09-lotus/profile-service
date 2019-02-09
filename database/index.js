const mysql = require('mysql');
require('dotenv').config();

const credentials = () => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      database: 'profiles_db',
      host: process.env.LOCAL_DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    };
  } else {
    return {
      database: 'profiles_db',
      host: process.env.EC2_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    };
  }
};

const connection = mysql.createConnection(credentials());

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM profiles WHERE prof_id = ${id}`, function (
      err,
      rows,
      fields
    ) {
      if (err) { throw err; }
      resolve(rows);
    });
  });
};

const getUserActivities = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT act_name FROM prof_act INNER JOIN activities ON activities.act_id = prof_act.act_id WHERE prof_id = ${id}`,
      function (err, rows, fields) {
        if (err) { throw err; }
        resolve(rows);
      }
    );
  });
};

const updateFirstName = (id, newName) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE profiles SET first_name = '${newName}' WHERE prof_id = ${id}`, function (
      err,
      row,
      fields
    ) {
      if (err) { throw err; }
      resolve(row);
    });
  });
};


module.exports = {
  getUser,
  getUserActivities,
  updateFirstName
};
