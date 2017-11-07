import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Stickies } from './stickies';

// TODO: https://guide.meteor.com/collections.html#collection-helpers

const Boards = new Mongo.Collection('boards');
Boards.schema = new SimpleSchema({
  name: {
    type: String,
  },
  version: {
    type: Number,
    defaultValue: 1,
  },
});

Boards.helpers({
  stickies() {
    // eslint-disable-next-line no-underscore-dangle
    return Stickies.find({ boardId: this._id }, { sort: { columnId: 1 } });
  },
});

Boards.allow({
  insert: () => (true),
});

// eslint-disable-next-line import/prefer-default-export
export { Boards };
