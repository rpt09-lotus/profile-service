const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// const setPORT = () => {
//   if (process.env.NODE_ENV !== 'production') {
//     return 3002;
//   } else {
//     return 80;
//   }
// };

// setPORT();
const PORT = 3002;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../public/'));

app.get('/:trailId(\\d+$)*?', function (req, res) {
  res.status(200).sendFile(path.resolve(__dirname + '/../public/index.html'));
});

app.get('/user/:id', function (req, res) {
  let finalData;
  db.getUser(req.params.id)
    .then((rawUserData) => {
      const rawData = rawUserData[0];
      let userData = {
        data: {
          type: 'users',
          id: rawData.prof_id,
          attributes: {
            first_name: rawData.first_name,
            last_name: rawData.last_name,
            email: rawData.email,
            location: rawData.location,
            date_joined: rawData.date_joined.toJSON().substring(0, 10),
            favorite_activities: [],
            bio: rawData.bio,
            photo_url: rawData.photo_url,
            pro: !!+rawData.pro
          }
        }
      };

      return userData;
    })
    .then((userData) => {
      finalData = userData;
      return db.getUserActivities(userData.data.id);
    })
    .then((rows) => {
      return rows.map((row) => {
        return row.act_name;
      });
    })
    .then((activities) => {
      finalData.data.attributes.favorite_activities = activities;
      return finalData;
    })
    .then((data) => {
      res.send(data);
    });
});

app.patch('/user/:id/:newName', function (req, res) {
  db.updateFirstName(req.params.id, req.params.newName)
    .then((profileRow) => {
      db.getUser(req.params.id)
        .then((rawUserData) => {
          const rawData = rawUserData[0];
          let userData = {
            data: {
              type: 'users',
              id: rawData.prof_id,
              attributes: {
                first_name: rawData.first_name,
                last_name: rawData.last_name,
                email: rawData.email,
                location: rawData.location,
                date_joined: rawData.date_joined.toJSON().substring(0, 10),
                favorite_activities: [],
                bio: rawData.bio,
                photo_url: rawData.photo_url,
                pro: !!+rawData.pro
              }
            }
          };

          return userData;
        })
        .then((data) => {
          console.log('data: ', data);
          res.send(data);
        });
    });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
