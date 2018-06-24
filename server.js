require('dotenv').config();
const express = require('express');
const expressGraphQL = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');

const app = express();

app.use(cors()); // not having cors enabled will cause an access control error
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening on port 4000!');
});
