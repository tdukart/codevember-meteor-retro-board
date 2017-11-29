import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from './boards';

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

if (Meteor.isServer) {
  Meteor.methods({
    'stickies.insert': function stickiesInsert({
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
    'stickies.update': function stickiesUpdate(_id, { body }) {
      check(_id, String);
      check(body, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Stickies.update(_id, {
        $set: {
          body,
          updater: this.userId,
        },
      });
    },
  });


  Meteor.publishComposite('stickies.inBoard', (boardId) => {
    new SimpleSchema({ boardId: { type: String } }).validate({ boardId });

    return {
      find() {
        const query = {
          _id: boardId,
        };

        return Boards.find(query);
      },

      children: [{
        find(board) {
          return Stickies.find({ boardId: board._id });
        },
      }],
    };
  });
}

// eslint-disable-next-line import/prefer-default-export
export { Stickies };
