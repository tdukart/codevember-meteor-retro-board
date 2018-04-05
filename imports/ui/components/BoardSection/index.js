import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Glyphicon } from 'react-bootstrap';

import Sticky from '../Sticky';

import { styles } from './style.scss';

const BoardSection = ({
  title,
  stickies,
  onCreateSticky,
  showAdd,
  columns,
}) => {
  const stickyList = stickies.map(stickyData => (
    <Sticky
      key={`sticky-${stickyData._id}`}
      _id={stickyData._id}
      body={stickyData.body}
      notes={stickyData.notes}
      color={stickyData.color}
      columns={columns}
      columnId={stickyData.columnId}
      plusOnes={stickyData.plusOnes || []}
      creator={stickyData.creator}
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
      {showAdd ?
        <Button onClick={addSticky} bsStyle="success">
          <Glyphicon glyph="plus" />
        </Button>
        : ''}
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
    notes: PropTypes.string.isRequired,
    color: PropTypes.string,
  })).isRequired,
  onCreateSticky: PropTypes.func.isRequired,
  showAdd: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
};

export default BoardSection;
