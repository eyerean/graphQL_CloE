const express = require('express');
const expressGraphQL = require('express-graphql');
require('dotenv').config();
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening on port 4000!');
});
