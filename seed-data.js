// Data generation for csv file output

// Start timer
let start = new Date();

const fs = require('fs');
const csv = require('fast-csv');
const faker = require('faker');

const csvStream = csv.createWriteStream({ headers: true });
const ws = fs.createWriteStream('./seed-data.csv');
// Pipe csv to node write stream
csvStream.pipe(ws);
// Write header line
csvStream.write([
  'firstName',
  'lastName',
  'email',
  'location',
  'dateJoined',
  'bio',
  'photoUrl',
  'pro',
  'activities'
]);

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
for (let i = 1; i < count; i++) {
  let profile = [];
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let email = faker.internet.email();
  let location = faker.address.city() + ', ' + faker.address.state();
  let dateJoined = faker.date.month();
  let bio = faker.lorem.sentence();
  let photoUrl = getRandomImg();
  let pro = '0';
  let activities = `["${faker.lorem.word()}","${faker.lorem.word()}","${faker.lorem.word()}","${faker.lorem.word()}","${faker.lorem.word()}"]`;
  // Array-i-fy it for the stream
  profile = [
    firstName,
    lastName,
    email,
    location,
    dateJoined,
    bio,
    photoUrl,
    pro,
    activities
  ];
  // Add it to the write stream
  csvStream.write(profile);
}

csvStream.end();

csvStream.on('end', () => {
  let end = new Date();
  let seconds = (end.getTime() - start.getTime()) / 1000;
  console.log(
    `... ⏰ Done! Wrote ${count} records to seed-data.csv in ${seconds} seconds`
  );
});
