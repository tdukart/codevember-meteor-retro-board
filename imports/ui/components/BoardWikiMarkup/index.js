import React from 'react';
import PropTypes from 'prop-types';
import { filter, capitalize, map } from 'lodash';
import { Panel, FormControl } from 'react-bootstrap';
import { emojify } from 'node-emoji';

const BoardWikiMarkup = ({ stickies, columns = [] }) => {
  const columnsWikiMarkup = columns.map(({ key }) => {
    const columnStickies = filter(stickies, { columnId: key });
    const columnListItems = columnStickies.map((sticky) => {
      const notes = sticky.notes ? `- ${sticky.notes}` : '';
      return `* *${emojify(sticky.body)}* ${emojify(notes)}`;
    });

    if (columnListItems.length === 0) {
      return (' ');
    }

    return columnListItems.join('\n');
  });

  const columnTitles = map(columns, 'name');

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
  columns: PropTypes.array.isRequired,
};

export default BoardWikiMarkup;
