import React from 'react';
// eslint-ignore-next-line
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
