const cors = require('cors');
const express = require('express');
const apolloServerExpress = require('apollo-server-express');
const schemaPrinter = require('graphql/utilities/schemaPrinter');
const schema = require('./graphql/schema');

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
  res.send('POST request to the homepage');
});

const app = express();
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});
app.use(
  '/graphql',
  apolloServerExpress.graphqlExpress({ schema })
);
app.use(
  '/graphiql',
  apolloServerExpress.graphiqlExpress({ endpointURL: '/api/graphql' })
);
app.use('/schema', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(schemaPrinter.printSchema(schema));
});

module.exports = {
  jsonImporter,
  app
};
