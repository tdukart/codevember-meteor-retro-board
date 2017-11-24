import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
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

Meteor.methods({
  'stickies.insert'({
    body,
    columnId,
    boardId,
    color = 'yellow',
  }) {
    check(body, String);
    check(columnId, String);
    check(boardId, String);
    check(color, String);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Stickies.insert({
      body,
      columnId,
      boardId,
      color,
      creator: this.userId,
    });
  },
  'stickies.update'(_id, { body }) {
    check(_id, String);
    check(body, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Stickies.update(_id, {
      body,
      updater: this.userId,
    });
  },
});

// eslint-disable-next-line import/prefer-default-export
export { Stickies };
