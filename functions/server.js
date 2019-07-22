const cors = require('cors');
const express = require('express');
const apolloServerExpress = require('apollo-server-express');
const schemaPrinter = require('graphql/utilities/schemaPrinter');
const schema = require('./graphql/schema');
const firebase = require('firebase');
const {db} = require('./firebase');

const jsonImporter = express();
jsonImporter.use(cors());
jsonImporter.options('*', cors());
jsonImporter.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});

jsonImporter.post('/', (req, res) => {
  req.body.CVE_Items.map((cveItem) => {
    let cveString = cveItem.cve.CVE_data_meta.ID;
    let vulnData = {
      description: '',
      affected_product: []
    };
    console.log("CVE: " + cveString);
    let desc = cveItem.cve.description.description_data[0].value;
    vulnData.description = desc;
    console.log("Desc: " + desc);
    let cpe = cveItem.configurations.nodes.map((node) => {
      return node.cpe_match.map((cpe_match) => {
        let cpeString = cpe_match.cpe23Uri;
        vulnData.affected_product.push(cpeString);
        return cpeString;
      });
    });

    db.collection("vulnerabilities").doc(cveString).set(vulnData)
    .then(function() {
      console.log("Document successfully written!");
      res.send('Successfully imported vulnerability data' + "\n");
      return;
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
      res.send("Error writing document: ", error);
    });
  });
});

const graphqlServer = express();
graphqlServer.use(cors());
graphqlServer.options('*', cors());
graphqlServer.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});
graphqlServer.use(
  '/graphql',
  apolloServerExpress.graphqlExpress({ schema })
);
graphqlServer.use(
  '/graphiql',
  apolloServerExpress.graphiqlExpress({ endpointURL: '/api/graphql' })
);
graphqlServer.use('/schema', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(schemaPrinter.printSchema(schema));
});

module.exports = {
  jsonImporter,
  graphqlServer
};
