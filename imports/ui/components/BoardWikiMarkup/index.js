import React from 'react';
import PropTypes from 'prop-types';
import { filter, capitalize } from 'lodash';
import { Panel, FormControl } from 'react-bootstrap';
import { emojify } from 'node-emoji';

import columns from '../../util/columns';

const BoardWikiMarkup = ({ stickies }) => {
  const columnsWikiMarkup = columns.map((columnId) => {
    const columnStickies = filter(stickies, { columnId });
    const columnListItems = columnStickies.map((sticky) => {
      const notes = sticky.notes ? `- ${sticky.notes}` : '';
      return `* *${emojify(sticky.body)}* ${emojify(notes)}`;
    });

    if (columnListItems.length === 0) {
      return (' ');
    }

    return columnListItems.join('\n');
  });

  const columnTitles = columns.map(columnId => (capitalize(columnId)));

  const boardWikiMarkup = `||${columnTitles.join('||')}||\n|${columnsWikiMarkup.join('|')}|`;
  const panelHeader = <h2>Wiki Markup</h2>;

  return (
    <Panel header={panelHeader}>
      <FormControl componentClass="textarea" value={boardWikiMarkup} readOnly />
    </Panel>
  );
};

BoardWikiMarkup.propTypes = {
  stickies: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BoardWikiMarkup;
