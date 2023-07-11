const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const app = express();

const carTypes = [
    { id: 1, name: 'Sedan' },
    { id: 2, name: 'SUV' },
    { id: 3, name: 'Sports Car' }
];

const carModels = [
    { id: 1, name: 'Toyota Camry', typeId: 1 },
    { id: 2, name: 'Honda CR-V', typeId: 2 },
    { id: 3, name: 'Ford Mustang', typeId: 3 },
    { id: 4, name: 'BMW 3 Series', typeId: 1 }
];

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const CarModelType = new GraphQLObjectType({
    name: 'CarModel',
    description: 'This represents a car model of a specific type',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        typeId: { type: GraphQLNonNull(GraphQLInt) },
        type: {
            type: CarType,
            resolve: (carModel) => {
                return carTypes.find(type => type.id === carModel.typeId);
            }
        }
    })
});

const CarType = new GraphQLObjectType({
    name: 'CarType',
    description: 'This represents a car type',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        models: {
            type: new GraphQLList(CarModelType),
            resolve: (carType) => {
                return carModels.filter(model => model.typeId === carType.id);
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        carModels: {
            type: new GraphQLList(CarModelType),
            description: 'List of all car models',
            resolve: () => carModels
        },
        carTypes: {
            type: new GraphQLList(CarType),
            description: 'List of all car types',
            resolve: () => carTypes
        },
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log("Server is running!"));
