import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Glyphicon } from 'react-bootstrap';

import Sticky from '../Sticky';

import { styles } from './style.scss';

const BoardSection = ({
  title, stickies, onCreateSticky,
}) => {
  const stickyList = stickies.map(stickyData => (
    <Sticky
      key={`sticky-${stickyData._id}`}
      body={stickyData.body}
      color={stickyData.color}
    />
  ));

  const addSticky = onCreateSticky;

  const panelHeader = (
    <h2>
      {title}
    </h2>
  );

  const panelFooter = (
    <div>
      <Button onClick={addSticky} bsStyle="success">
        <Glyphicon glyph="plus" />
      </Button>
    </div>
  );

  return (
    <Panel header={panelHeader}>
      <div className={styles.sectionStickies}>
        {stickyList}
        {panelFooter}
      </div>
    </Panel>
  );
};

BoardSection.propTypes = {
  title: PropTypes.string.isRequired,
  stickies: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    color: PropTypes.string,
  })).isRequired,
  onCreateSticky: PropTypes.func.isRequired,
};

export default BoardSection;
