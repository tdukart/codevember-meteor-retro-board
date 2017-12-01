import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import emoji from 'node-emoji';

import CreateSticky from '../CreateSticky';

import { styles } from './style.scss';

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStickyDialog: false,
    };
  }

  static get propTypes() {
    return {
      _id: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      color: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      color: '',
    };
  }

  render() {
    const { body, color, _id } = this.props;
    const { showStickyDialog } = this.state;
    const cssClasses = [styles.sticky];
    if (color !== '') {
      cssClasses.push(styles[color]);
    }

    const startStickyEdit = () => {
      this.setState({ showStickyDialog: true });
    };

    const onStickyCreate = (stickyData) => {
      Meteor.call('stickies.update', _id, stickyData);
      this.setState({ showStickyDialog: false });
    };

    const onStickyDialogClose = () => {
      this.setState({ showStickyDialog: false });
    };

    return (
      <div className={cssClasses.join(' ')}>
        {emoji.emojify(body)}
        <div className={styles.footer}>
          <Button onClick={startStickyEdit} bsSize="xsmall" bsStyle="default">
            <Glyphicon glyph="pencil" />
          </Button>
        </div>
        <CreateSticky
          show={showStickyDialog}
          onCreate={onStickyCreate}
          onClose={onStickyDialogClose}
          body={body}
        />
      </div>
    );
  }
}

export default Sticky;
