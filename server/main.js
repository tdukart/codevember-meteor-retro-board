import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import '../imports/api/boards';
import '../imports/api/stickies';

import './accountConfig';

Meteor.startup(() => {
  // code to run on server at startup
});
