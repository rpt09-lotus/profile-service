// Data generation for csv file output
// Testing vs. seed-data.js:
//    - use Node createWriteStream, not fast-csv
//    - try faker.fake syntax vs separate function calls
//    - https://github.com/marak/Faker.js/#fakerfake

// Start timer
let start = new Date();

const fs = require('fs');
const file = fs.createWriteStream('./seed-data2.csv');
const faker = require('faker');

// Write header line
file.write(
  'firstName,lastName,email,location,dateJoined,bio,photoUrl,pro,activities\n'
);

// Random Facebook image url
const getRandomImg = () => {
  let imgId = Math.floor(Math.random() * (10000 - 5)) + 4;
  return (
    'http://graph.facebook.com/v2.5/' + imgId + '/picture?height=200&width=200'
  );
};
// How many datas?
let count = 10000000;
// Get that fake data
for (let i = 0; i < count; i++) {
  // Build string for each csv row
  let profile = '';

  profile = faker.fake(
    '{{name.firstName}},{{name.lastName}},{{internet.email}},"{{address.city}},{{address.state}}",{{date.month}},"{{lorem.sentence}}",'
  );
  // Add photoUrl
  profile += getRandomImg() + ',' + '0,"["';
  // Add activities "stringified array" for mongoimport format
  profile += faker.fake(
    '"{{lorem.word}}","{{lorem.word}}","{{lorem.word}}","{{lorem.word}}","{{lorem.word}}"'
  );

  profile += '"]"\n';

  // Write the row
  file.write(profile);
}

file.end();

file.on('close', () => {
  let end = new Date();
  let seconds = (end.getTime() - start.getTime()) / 1000;
  console.log(
    `... ⏰ Done! Wrote ${count} records to seed-data2.csv in ${seconds} seconds`
  );
});
