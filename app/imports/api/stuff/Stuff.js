import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Stuffs = new Mongo.Collection('Stuffs');

/** Define a schema to specify the structure of each document in the collection. */
const StuffSchema = new SimpleSchema({
  title: String,
  description: String,
  location: String,
  startDate: String,
  endDate: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
//Stuffs.attachSchema(StuffSchema);

/** Make the collection and schema available to other code. */
export { Stuffs, StuffSchema };
