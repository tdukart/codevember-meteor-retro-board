/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-var */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import faker from 'faker';

import Boards from './boards';

Factory.define('user', Meteor.users, {
  password: () => faker.internet.password(),
  emails: () => [{ address: faker.internet.email(), verified: true }],
});

Factory.define('board', Boards, {
  name: () => faker.random.word(),
  version: 1,
});

if (Meteor.isServer) {
  describe('boards collection', function () {
    let user;

    beforeEach(function () {
      resetDatabase();

      user = Factory.create('user');
      sinon.stub(Meteor, 'userId');
      Meteor.userId.returns(user._id);
    });

    it('allows a board to be created', function () {
      const boardName = faker.random.word();

      const boardId = Meteor.call('boards.insert', boardName);
      chai.assert.isNotNull(boardId);
    });

    afterEach(function () {
      if (Meteor.userId.restore) {
        Meteor.userId.restore();
      }
    });
  });
}
