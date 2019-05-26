const graphqlTools = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
  input VulnInput {
    id: String!
    description: String
  }
  type Vulnerability {
    id: String!
    description: String
  }
  type Query {
    vulnerabilities: [Vulnerability]
  }
  type Mutation {
    addVulnerability(input: VulnInput!): Vulnerability
  }
`;
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
