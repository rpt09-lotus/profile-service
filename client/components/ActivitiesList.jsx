import React, { Component } from 'react';
import styles from '../css/style.css';

function ActivitiesList(props) {
  const activitiesList = props.activities;
  const activitiesTags = activitiesList.map((activity) => {
    return <div key={activity} className={styles.activitiesTags}>{activity}</div>
  });
  console.log('activitiesTags: ', activitiesTags);
  return (
    <div className={styles.activitiesTagList}>{activitiesTags}</div>
  );
}

module.exports = ActivitiesList;
