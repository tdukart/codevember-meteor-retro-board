/* eslint-disable react/no-string-refs, react/no-find-dom-node */
// Borrowed/stolen from the Meteor React tutorial: https://www.meteor.com/tutorials/react/adding-user-accounts
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

class AccountsUIWrapper extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(
      Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container),
    );
  }

  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }

  render() {
    return <span ref="container" />;
  }
}

export default AccountsUIWrapper;
