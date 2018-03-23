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

if (Meteor.isServer) {
  Meteor.methods({
    'boards.insert': function boardsInsert(name) {
      check(name, String);

      const userId = Meteor.userId();

      // Make sure the user is logged in before inserting a task
      if (!userId) {
        throw new Meteor.Error('not-authorized');
      }

      return Boards.insert({
        name,
        createdAt: Date.now(),
        owner: userId,
      });
    },
  });

  Meteor.publish('boards', () => Boards.find({}, { sort: { createdAt: -1 } }));
}

// eslint-disable-next-line import/prefer-default-export
export { Boards };
