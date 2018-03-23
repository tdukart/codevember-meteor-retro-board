import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
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
      notes,
      columnId,
      boardId,
      color = 'yellow',
    }) {
      check(body, String);
      check(notes, Match.Maybe(String));
      check(columnId, String);
      check(boardId, String);
      check(color, String);

      // Make sure the user is logged in before inserting a task
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Stickies.insert({
        body,
        notes,
        columnId,
        boardId,
        color,
        creator: this.userId,
      });
    },
    'stickies.update': function stickiesUpdate(_id, { body, notes }) {
      check(_id, String);
      check(body, String);
      check(notes, Match.Maybe(String));

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Stickies.update(_id, {
        $set: {
          body,
          notes,
          updater: this.userId,
        },
      });
    },
    'stickies.move': function stickiesMove(_id, { columnId }) {
      check(_id, String);
      check(columnId, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Stickies.update(_id, {
        $set: {
          columnId,
          updater: this.userId,
        },
      });
    },
    'stickies.addPlusOne': function stickiesAddPlusOne(_id) {
      check(_id, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      const sticky = Stickies.findOne(_id);
      if (!sticky) {
        throw new Meteor.Error('not-found');
      }

      let { plusOnes } = sticky;
      if (!plusOnes) {
        plusOnes = [];
      }
      if (plusOnes.indexOf(this.userId) === -1) {
        plusOnes.push(this.userId);
        Stickies.update(_id, {
          $set: {
            plusOnes,
          },
        });
      }
    },
    'stickies.removePlusOne': function stickiesRemovePlusOne(_id) {
      check(_id, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      const sticky = Stickies.findOne(_id);
      if (!sticky) {
        throw new Meteor.Error('not-found');
      }

      let { plusOnes } = sticky;
      if (!plusOnes) {
        plusOnes = [];
      }
      const myPlusOneIdx = plusOnes.indexOf(this.userId);
      if (myPlusOneIdx !== -1) {
        plusOnes.splice(myPlusOneIdx, 1);
        Stickies.update(_id, {
          $set: {
            plusOnes,
          },
        });
      }
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
