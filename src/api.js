import axios from 'axios';

const prefix = process.env.REACT_APP_API_PREFIX;
  
export const fcm = (token, userId) =>
  axios.put(`${prefix}/fcmToken`, { token, userId });
