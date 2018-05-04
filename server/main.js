import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { IncomingWebhook } from '@slack/client';

import '../imports/api/boards';
import '../imports/api/stickies';

import './accountConfig';

Meteor.startup(() => {
  if (Meteor.settings.slack && Meteor.settings.slack.hooks) {
    Meteor.settings.slack.hooks.forEach((url) => {
      const webhook = new IncomingWebhook(url);
      const message = {
        text: `Retro board is booted and ready at ${Meteor.absoluteUrl()}`,
      };
      webhook.send(message);
    })
  }
});

Accounts.validateNewUser((user) => {
  if (user.services.google.email.match(/@globe\.com$/)) {
    return true;
  }
  throw new Meteor.Error('globe-account-required', 'You must sign in using a globe.com account');
});
