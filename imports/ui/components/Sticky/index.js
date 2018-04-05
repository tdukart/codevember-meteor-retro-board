// eslint-ignore react/no-danger
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import emoji from 'node-emoji';
import truncateUrl from 'truncate-url';
import linkifyUrls from '@tdukart/linkify-urls';

import CreateSticky from '../CreateSticky';
import MoveSticky from '../MoveSticky';

import { styles } from './style.scss';

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStickyDialog: false,
      showMoveDialog: false,
    };
  }

  render() {
    const {
      body,
      notes,
      columnId,
      columns,
      color,
      creator,
      plusOnes,
      _id,
    } = this.props;
    const { showStickyDialog, showMoveDialog } = this.state;
    const userId = Meteor.userId();

    const cssClasses = [styles.sticky];
    if (color !== '') {
      cssClasses.push(styles[color]);
    }

    const startStickyEdit = () => {
      this.setState({ showStickyDialog: true });
    };

    const startStickyMove = () => {
      this.setState({ showMoveDialog: true });
    };

    const onStickyMove = (stickyData) => {
      Meteor.call('stickies.move', _id, stickyData);
      this.setState({ showMoveDialog: false });
    };

    const onStickyCreate = (stickyData) => {
      Meteor.call('stickies.update', _id, stickyData);
      this.setState({ showStickyDialog: false });
    };

    const onStickyDialogClose = () => {
      this.setState({ showStickyDialog: false });
    };

    const onMoveDialogClose = () => {
      this.setState({ showMoveDialog: false });
    };

    const onStickyAddPlusOne = () => {
      Meteor.call('stickies.addPlusOne', _id);
    };

    const onStickyRemovePlusOne = () => {
      Meteor.call('stickies.removePlusOne', _id);
    };

    const plusOneAddTooltip = (
      <Tooltip id="plusOneAddTooltip">
        Add a +1 reaction
      </Tooltip>
    );
    const plusOneRemoveTooltip = (
      <Tooltip id="plusOneRemoveTooltip">
        Remove your +1 reaction
      </Tooltip>
    );
    const plusOneOwnTooltip = (
      <Tooltip id="plusOneOwnTooltip">
        This is your sticky; you can&apos;t +1 it
      </Tooltip>
    );

    let plusOnesButton;
    if (userId === creator) {
      // You can't +1 yourself, young one.
      plusOnesButton = (
        <OverlayTrigger placement="bottom" overlay={plusOneOwnTooltip}>
          <Button disabled bsSize="xsmall" bsStyle="default">
            +1
          </Button>
        </OverlayTrigger>
      );
    } else if (plusOnes.indexOf(userId) !== -1) {
      plusOnesButton = (
        <OverlayTrigger placement="bottom" overlay={plusOneRemoveTooltip}>
          <Button active bsStyle="default" bsSize="xsmall" onClick={onStickyRemovePlusOne}>
            +1
          </Button>
        </OverlayTrigger>
      );
    } else {
      plusOnesButton = (
        <OverlayTrigger placement="bottom" overlay={plusOneAddTooltip}>
          <Button bsStyle="default" bsSize="xsmall" onClick={onStickyAddPlusOne}>
            +1
          </Button>
        </OverlayTrigger>
      );
    }

    const truncateUrlTo20 = url => (truncateUrl(url, 20));

    let formattedBody = emoji.emojify(body);
    formattedBody = linkifyUrls(formattedBody, { value: truncateUrlTo20, attributes: { target: '_blank' } });

    let formattedNotes = emoji.emojify(notes);
    formattedNotes = linkifyUrls(formattedNotes, { value: truncateUrlTo20, attributes: { target: '_blank' } });

    const editTooltip = <Tooltip id="editTooltip">Edit sticky or add notes</Tooltip>;
    const moveTooltip = <Tooltip id="moveTooltip">Move to new column</Tooltip>;

    return (
      <div className={cssClasses.join(' ')}>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: formattedBody }}
        />
        <p
          className={styles.notes}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: formattedNotes }}
        />
        <div className={styles.footer}>
          <OverlayTrigger placement="bottom" overlay={editTooltip}>
            <Button onClick={startStickyEdit} bsSize="xsmall" bsStyle="default">
              <Glyphicon glyph="pencil" />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={moveTooltip}>
            <Button onClick={startStickyMove} bsSize="xsmall" bsStyle="default">
              <Glyphicon glyph="resize-horizontal" />
            </Button>
          </OverlayTrigger>
          {plusOnesButton} ({plusOnes.length})
        </div>
        <CreateSticky
          show={showStickyDialog}
          onCreate={onStickyCreate}
          onClose={onStickyDialogClose}
          body={body}
          notes={notes}
          showNotes
        />
        <MoveSticky
          show={showMoveDialog}
          onMove={onStickyMove}
          onClose={onMoveDialogClose}
          columnId={columnId}
          columns={columns}
        />
      </div>
    );
  }
}

Sticky.propTypes = {
  _id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  plusOnes: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
};

Sticky.defaultProps = {
  color: '',
};

export default Sticky;
