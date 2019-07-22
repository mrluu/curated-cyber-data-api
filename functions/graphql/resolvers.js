const firebase = require('firebase');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {db} = require('../firebase');

var collectionRef = db.collection("vulnerabilities");

module.exports = {
  Query: {
    vulnerabilities() {
      console.log("vulnerabilities() ");
      return collectionRef.get().then((results) => {
        console.log("RESULTS size: " + results.size);
        if (results.size > 0) {
          return results.docs.map(doc => {
            let target = Object.assign({id: doc.id}, {description: doc.data().description});
            console.log(target);

            let platformz = doc.ref.collection("affected_product").get().then((platforms) => {
              if (platforms.size > 0) {
                return platforms.docs.map(platform => {
                  let p = Object.assign({}, {cpe: platform.id});
                  console.log("CPE: " + p.cpe);
                  return p;
                });
              }
              else {
                return [];
              }
            });

            return Object.assign(target, {affectedProducts: platformz});
          });
        }
        else {
          return [];
        }
      });
    }
  },
  Mutation: {
    addVulnerability(_, { input }) {
      console.log("addVulnerability() ");
      return (
        new Promise((resolve) => {
          collectionRef.doc(input.id).set({
            description: input.description,
          })
          .then(function() {
            console.log("Document successfully written!");
            return resolve(Object.assign({}, input));
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
        })
      );
    }
  }
};
