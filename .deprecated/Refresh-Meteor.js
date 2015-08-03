Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  console.log("Hey, server speaking!");
}

if (Meteor.isClient) {
  // This code only runs on the client
  console.log("Hey, client speaking!");

  Template.t_1.name = "Finnian";
  Template.t_2.name = "Alex";
}