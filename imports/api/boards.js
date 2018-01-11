import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Stickies } from './stickies';

// TODO: https://guide.meteor.com/collections.html#collection-helpers

const validStatuses = ['setup', 'open', 'discuss', 'closed'];

const Boards = new Mongo.Collection('boards');
Boards.schema = new SimpleSchema({
  name: {
    type: String,
  },
  version: {
    type: Number,
    defaultValue: 2,
  },
  status: {
    type: String,
    allowedValues: validStatuses,
  },
});

const isValidStatus = Match.Where((status) => {
  check(status, String);
  return validStatuses.indexOf(status) !== -1;
});

const allowedStatusesForBoard = (userId, board) => {
  const statusIndex = validStatuses.indexOf(board.status);
  if (!board.status || statusIndex === -1) {
    return validStatuses;
  }

  const result = [];
  if (statusIndex !== 0 && userId === board.owner) {
    result.push(validStatuses[0]);
  }
  if (statusIndex < validStatuses.length - 1) {
    result.push(validStatuses[statusIndex + 1]);
  }
  return result;
};

Boards.helpers({
  /**
   * Get the board's stickies.
   *
   * @returns {Sticky[]}
   */
  stickies() {
    // eslint-disable-next-line no-underscore-dangle
    return Stickies.find({ boardId: this._id }, { sort: { columnId: 1 } });
  },

  /**
   * Get the statuses that this board can be set to:
   *   - The next status.
   *   - If the current user owns the board, or is an admin, the first status ('setup').
   *
   * @todo When #22 is implemented, allow admins to reset the board.
   * @returns {string[]}
   */
  allowedStatuses() {
    return allowedStatusesForBoard(Meteor.userId(), this);
  },
});

if (Meteor.isServer) {
  Meteor.methods({
    'boards.insert': function boardsInsert(name) {
      check(name, String);

      // Make sure the user is logged in before inserting a board
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Boards.insert({
        name,
        version: 2,
        status: validStatuses[0],
        createdAt: Date.now(),
        owner: this.userId,
      });
    },
    'boards.setStatus': function boardsSetStatus(_id, { status }) {
      check(_id, String);
      check(status, isValidStatus);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      const board = Boards.findOne(_id);
      if (!board) {
        throw new Meteor.Error('not-found');
      }

      const allowedStatuses = allowedStatusesForBoard(this.userId, board);

      if (allowedStatuses.indexOf(status) === -1) {
        throw new Meteor.Error('not-allowed');
      }

      Boards.update(_id, {
        $set: {
          status,
        },
      });
    },
  });

  Meteor.publish('boards', () => (
    Boards.find()
  ));
}

// eslint-disable-next-line import/prefer-default-export
export { Boards };
