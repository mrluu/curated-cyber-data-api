const graphqlTools = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
type Vulnerability {
  id: String!
  description: String
}
type Query {
  vulnerabilities: [Vulnerability]
}
`;
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
