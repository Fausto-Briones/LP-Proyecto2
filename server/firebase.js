const admin = require('firebase-admin');
const serviceAccount = require('./proyectolp2-2e43b-firebase-adminsdk-dxjkd-928271b5d9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://proyectolp2-2e43b-default-rtdb.firebaseio.com/', 
});

const db = admin.database();

module.exports = db;