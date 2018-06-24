const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType
} = graphql;

const header = {authorization: `Bearer ${process.env.TOKEN}`};

const TagInputType = new GraphQLInputObjectType({
  name: 'TagInput',
  fields: {
    and: {type: GraphQLList(GraphQLString)},
    asset: {type: GraphQLString}
  }
});

const DataInputType = new GraphQLInputObjectType({
  name: 'DataInput', 
  fields: {
    script: {type: GraphQLString},
    tag: {type: new GraphQLList(TagInputType)}
  }
});

const TagType = new GraphQLObjectType({
  name: 'Tag',
  fields: {
    and: {type: GraphQLList(GraphQLString)},
    asset: {type: GraphQLString}
  }
});

const DataType = new GraphQLObjectType({
  name: 'Data', 
  fields: {
    script: {type: GraphQLString},
    tag: {type: new GraphQLList(TagType)}
  }
});

const FlowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    debug: {type: GraphQLBoolean},
    flowId: {type: GraphQLInt},
    flowName: {type: GraphQLString},
    lastChange: {type: GraphQLString},
    priority: {type: GraphQLBoolean},
    state: {type: GraphQLString},
    data: {type: DataType}
  }
});

//entry points
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    flow: {
      type: FlowType,
      args: { flowId: {type: GraphQLInt}},
      resolve(parentValue, args) {
        return axios.get(`${process.env.API_ROOT}flows/${args.flowId}`, { headers: header })
          .then(response =>  response.data)
          .catch(function (error) {
            console.log('error!', error);
          });
      }
    }
  }
});

// used to change our data
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addFlow: {
      type: FlowType, // the type of data the resolve function returns
      args: {
        flowName: {type: new GraphQLNonNull(GraphQLString)},
        debug: {type: new GraphQLNonNull(GraphQLBoolean)},
        priority: {type: new GraphQLNonNull(GraphQLBoolean)},
        state: {type: new GraphQLNonNull(GraphQLString)},
        type: {type: new GraphQLNonNull(GraphQLString)},
        data: {type: new GraphQLNonNull(DataInputType)}
      },
      resolve(parentValue, args) {
        return axios.post(`${process.env.API_ROOT}flows`, args, { headers: header })
          .then(res => res.data);
      }
    },
    deleteFlow: {
      type: GraphQLBoolean,
      args: {
        flowId: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parentValue, {flowId}) {
        return axios.delete(`${process.env.API_ROOT}flows/${flowId}`, { headers: header })
          .then(res => res.data);
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
