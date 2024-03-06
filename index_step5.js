var { graphqlHTTP } = require('express-graphql');
var { buildSchema, assertInputType } = require('graphql');
var express = require('express');

// Construct a schema, using GraphQL schema language
var restaurants =  [
    {
      "name": "WoodsHill ",
      "description": "American cuisine, farm to table, with fresh produce every day",
      "dishes": [
        {
          "name": "Swordfish grill",
          "price": 27
        },
        {
          "name": "Roasted Broccily ",
          "price": 11
        }
      ]
    },
    {
      "name": "Fiorellas",
      "description": "Italian-American home cooked food with fresh pasta and sauces",
      "dishes": [
        {
          "name": "Flatbread",
          "price": 14
        },
        {
          "name": "Carbonara",
          "price": 18
        },
        {
          "name": "Spaghetti",
          "price": 19
        }
      ]
    },
    {

      "name": "Karma",
      "description": "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
      "dishes": [
        {
          "name": "Dragon Roll",
          "price": 12
        },
        {
          "name": "Pancake roll ",
          "price": 11
        },
        {
          "name": "Cod cakes",
          "price": 13
        }
      ]
    }
  ];

// best practices for schema - anything that is an action in graphQL, name with a capital letter (i.e. Query and Mutation)
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  name: String
  description: String
  dishes: [dish]
}
type dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
  dishes: [dishInput]
}
input dishInput{
    name: String
    price: Int
  },
  {
    name: String
    price: Int 
  }
type Mutation{
  addrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): restaurant
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint


var root = {
  restaurant : (args) => {
    console.log(args)
    return restaurants[args.id]
  },
  //restaurant : ({id})=>{
    //console.log(id)
    //return restaurants[id]
  //},
  restaurants : ()=> restaurants,
  // say we passed args into this instead of {input}
  // would it be args.input.id? see line 92 
  addrestaurant : ({input}) => {
    console.log(input)
    //is this taking the id from the playground? does the schema come into play here? 
    // i.e. does the schema "input" called restaurantInput automatically get looked for, what if we had two inputs?
    restaurants.push({name: input.name,description: input.description, dishes: [{name: input.dishes[0].name, price: input.dishes[0].price}]})
    //would we then need to return args.input?
    return input
  },
  deleterestaurant : ({id})=>{
    const deletedItem = restaurants[id]
    console.log(deletedItem)
    restaurants = restaurants.filter((item, index) => index !== id)
    return deletedItem
  },
  editrestaurant: ({id, ...restaurant}) => {
    if(!restaurants[id]) {
      throw new Error("restaurant doesn't exist")
    }
    restaurants[id] = {
    ...restaurants[id],...restaurant
    }
    return restaurants[id]
  }
}
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var port = 5500
app.listen(5500,()=> console.log('Running Graphql on Port:'+port));