const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
const apolloServerExpress = require('apollo-server-express');
const schemaPrinter = require('graphql/utilities/schemaPrinter');
const schema = require('./graphql/schema');
const {graphqlServer, jsonImporter} = require('./server');

const ccd_api = functions.https.onRequest(graphqlServer);
const import_data = functions.https.onRequest(jsonImporter);

module.exports = {
  ccd_api,
  import_data
};
