import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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

Meteor.methods({
  'boards.insert': function boardsInsert(name) {
    check(name, String);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Boards.insert({
      name,
      createdAt: Date.now(),
      owner: this.userId,
    });
  },
});

// eslint-disable-next-line import/prefer-default-export
export { Boards };
