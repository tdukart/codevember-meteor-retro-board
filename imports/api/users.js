import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

import roles, { PERMISSION_ADMIN_USERS } from '../roles';

if (Meteor.isServer) {
  Meteor.methods({
    'users.assignRole': function usersAssignRole(_id, role) {
      check(_id, String);
      check(role, String);

      if (!Meteor.userId || !Roles.userIsInRole(Meteor.userId, PERMISSION_ADMIN_USERS)) {
        throw new Meteor.Error('not-authorized');
      }

      if (!roles[role]) {
        throw new Meteor.Error('invalid-role');
      }

      Roles.setUserRoles(_id, roles[role]);
    },
  });
}
