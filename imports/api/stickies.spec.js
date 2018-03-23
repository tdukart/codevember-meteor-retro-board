/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-var */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import faker from 'faker';

import { Boards } from './boards';
import { Stickies } from './stickies';

Factory.define('user', Meteor.users, {
  password: () => faker.internet.password(),
  emails: () => [{ address: faker.internet.email(), verified: true }],
});

Factory.define('board', Boards, {
  name: () => faker.random.word(),
  version: 1,
});

Factory.define('sticky', Stickies, {
  body: () => faker.lorem.paragraph(),
  creator: Factory.get('user'),
  column: faker.random.arrayElement(['start', 'stop', 'continue', 'questions']),
});

if (Meteor.isServer) {
  describe('stickies collection', function () {
    let board;
    let user;

    beforeEach(function () {
      resetDatabase();
      board = Factory.create('board');

      user = Factory.create('user');
      sinon.stub(Meteor, 'userId');
      Meteor.userId.returns(user._id);
    });

    it('allows a sticky to be created', function () {
      const stickyBody = faker.lorem.paragraph();

      const stickyId = Meteor.call('stickies.insert', { body: stickyBody, columnId: 'start', boardId: board._id });
      chai.assert.isNotNull(stickyId);
    });

    it('allows a sticky to be moved', function () {
      const sticky = Factory.create('sticky', { columnId: 'start' });
      Meteor.call('stickies.move', sticky._id, { columnId: 'stop' });

      const stickyData = Stickies.findOne(sticky._id);
      chai.assert.equal(stickyData.columnId, 'stop');
    });

    afterEach(function () {
      if (Meteor.userId.restore) {
        Meteor.userId.restore();
      }
    });
  });
}
