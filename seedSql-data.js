// Data generation for csv file output and MySQL import
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker');

const connection = mysql.createConnection({
  multipleStatements: true,
  database: 'profiles_db',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});
connection.connect();

const START_PROFILES = 101;
const TOTAL_PROFILES = 9999899;
const START_PROFILE_ACTIVITIES = 101;
const MAX_ACTIVITIES_PER_PROFILE = 4;
const MAX_ARRAY_LENGTH = 100;

const csvProfiles = createCsvWriter({
  path: 'database/profiles.csv',
  header: [
    { id: 'prof_id', title: 'prof_id' },
    { id: 'first_name', title: 'first_name' },
    { id: 'last_name', title: 'last_name' },
    { id: 'email', title: 'email' },
    { id: 'location', title: 'location' },
    { id: 'date_joined', title: 'date_joined' },
    { id: 'bio', title: 'bio' },
    { id: 'photo_url', title: 'photo_url' },
    { id: 'pro', title: 'pro' }
  ]
});

const csvProfileActivities = createCsvWriter({
  path: 'database/profileActivities.csv',
  header: [
    { id: 'act_id', title: 'act_id' },
    { id: 'prof_id', title: 'prof_id' }
  ]
});

const processSqlSchema = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname + '/schema.sql'), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).then((data) => {
    let sqlCopyString;
    const profilesString = /path\/to\/database\/profiles.csv/gi;
    const profileActivitiesString = /path\/to\/database\/profileActivities.csv/gi;
    sqlCopyString = data
      .toString()
      .replace(profilesString, process.env.PATH_TO_PROFILES_CSV)
      .replace(profileActivitiesString, process.env.PATH_TO_PROFILE_ACTIVITIES_CSV);
    const makeQuery = connection.query(sqlCopyString);
    return makeQuery;
  });
};

const addProfiles = () => {
  return new Promise(async (resolve, reject) => {
    const profilesToWrite = [];
    try {
      for (let i = START_PROFILES; i < START_PROFILES + TOTAL_PROFILES + 1; i++) {
        profilesToWrite.push({
          prof_id: i,
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          location: faker.address.city() + ', ' + faker.address.state(),
          date_joined: faker.date.month(),
          bio: faker.lorem.sentence(),
          photo_url: 'http://graph.facebook.com/v2.5/' +
            Math.floor(Math.random() * (10000 - 5)) + 4 +
            '/picture?height=200&width=200',
          pro: 0
        });

        if (profilesToWrite.length > MAX_ARRAY_LENGTH - 1 || i === START_PROFILES + TOTAL_PROFILES) {
          await csvProfiles.writeRecords(profilesToWrite);
          profilesToWrite.length = 0;
          if (i === START_PROFILES + TOTAL_PROFILES) {
            resolve();
          }
        }
      }
    } catch (err) {
      reject('Error writing profiles: ', err);
    }
  });
};

const addProfileActivities = () => {
  return new Promise(async (resolve, reject) => {
    const profActsToWrite = [];
    try {
      for (let i = START_PROFILES; i < START_PROFILES + TOTAL_PROFILES + 1; i++) {
        for (let j = 0; j < MAX_ACTIVITIES_PER_PROFILE; j++) {
          profActsToWrite.push({
            act_id: Math.floor(Math.random() * 101),
            prof_id: i
          });

          if ((profActsToWrite.length > MAX_ARRAY_LENGTH - 1) ||
            (i === START_PROFILE_ACTIVITIES + TOTAL_PROFILES) && (MAX_ACTIVITIES_PER_PROFILE - 1 === 3)
          ) {
            await csvProfileActivities.writeRecords(profActsToWrite);
            profActsToWrite.length = 0;
            if (i === START_PROFILE_ACTIVITIES + TOTAL_PROFILES) {
              resolve();
            }
          }
        }
      }
    } catch (err) {
      reject('Error writing profile activities: ', err);
    }
  });
};

const seedSqlData = (async () => {
  try {
    // Start timer
    let start = new Date();
    await addProfiles();
    await addProfileActivities();
    await processSqlSchema();
    let end = new Date();
    let seconds = (end.getTime() - start.getTime()) / 1000;
    console.log(
      `... ⏰  Done! Wrote ${TOTAL_PROFILES} profiles to DB in ${seconds} seconds`
    );
    connection.end();

  } catch (err) {
    console.error('seedSqlData error: ', err);
  }
})();
