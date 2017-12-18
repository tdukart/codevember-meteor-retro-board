import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

let { google } = Meteor.settings;
if (!google) {
  google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
  };
}

ServiceConfiguration.configurations.upsert({
  service: 'google',
}, {
  $set: {
    clientId: google.clientId,
    loginStyle: 'popup',
    secret: google.secret,
  },
});
