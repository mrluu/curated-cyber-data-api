const firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBqVrQj-_uuzu8UixrjY0ClxYXVx1ymhRw",
  authDomain: "curated-cyber-data.firebaseapp.com",
  databaseURL: "https://curated-cyber-data.firebaseio.com",
  projectId: "curated-cyber-data",
  storageBucket: "curated-cyber-data.appspot.com",
  messagingSenderId: "264727989056",
  appId: "1:264727989056:web:915a8c01305a172d"
};

const app = firebase.initializeApp(config);
const db = firebase.firestore(app);

module.exports = {
  app,
  db
}
