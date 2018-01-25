import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert({
  service: 'google',
}, {
  $set: {
    clientId: Meteor.settings.google.clientId,
    loginStyle: 'popup',
    secret: Meteor.settings.google.secret,
    hd: 'globe.com',
  },
});
