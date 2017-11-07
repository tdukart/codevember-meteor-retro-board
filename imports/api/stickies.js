import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Stickies = new Mongo.Collection('stickies');
Stickies.schema = new SimpleSchema({
  uuid: {
    type: String,
  },
  boardId: {
    type: String,
  },
  columnId: {
    type: String,
  },
  color: {
    type: String,
  },
  body: {
    type: String,
  },
});

Stickies.allow({
  insert: () => (true),
});

// eslint-disable-next-line import/prefer-default-export
export { Stickies };
