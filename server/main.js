import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../imports/api/boards';
import '../imports/api/stickies';

import './accountConfig';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.validateNewUser((user) => {
  if (user.services.google.email.match(/@globe\.com$/)) {
    return true;
  }
  throw new Meteor.Error(403, 'You must sign in using a globe.com account');
});
