import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from '../imports/api/boards';
import { Stickies } from '../imports/api/stickies';

Meteor.publish('boards', () => (
  Boards.find()
));

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

Meteor.startup(() => {
  // code to run on server at startup
});
