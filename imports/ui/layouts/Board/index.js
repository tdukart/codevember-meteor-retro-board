import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { capitalize, filter } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';

import { Boards } from '../../../api/boards';
import { Stickies } from '../../../api/stickies';

import BoardSection from '../../components/BoardSection/index';
import Spinner from '../../components/Spinner';
import CreateSticky from '../../components/CreateSticky';

import columns from '../../util/columns';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showStickyDialog: false,
      activeColumn: '',
    };
  }

  onStickyCreate({ body, columnId }) {
    const { boardId } = this.props.match.params;
    Stickies.insert({ body, columnId, boardId, color: 'yellow' });
    this.setState({
      showStickyDialog: false,
    });
  }

  onStickyDialogClose() {
    this.setState({
      showStickyDialog: false,
    });
  }

  render() {
    const { name, stickies, stickiesLoading } = this.props;
    const { boardId } = this.props.match.params;
    const { showStickyDialog } = this.state;

    const onStickyCreate = stickyData => this.onStickyCreate({
      columnId: this.state.activeColumn,
      ...stickyData
    });
    const onStickyDialogClose = () => this.onStickyDialogClose();

    const sections = columns.map(columnId => (
      <Col xs={12} sm={6} md={3} key={columnId}>
        <BoardSection
          title={capitalize(columnId)}
          stickies={filter(stickies, { columnId })}
          onCreateSticky={() => {
            this.setState({
              activeColumn: columnId,
              showStickyDialog: true,
            });
          }}
        />
      </Col>
    ));

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>{name}</h2>
            </Col>
          </Row>
          <Row>
            {stickiesLoading ? <Spinner/> : sections}
          </Row>
        </Grid>
        <CreateSticky
          show={showStickyDialog}
          onCreate={onStickyCreate}
          onClose={onStickyDialogClose}
        />
      </div>
    );
  }
}

Board.propTypes = {
  name: PropTypes.string.isRequired,
  stickies: PropTypes.arrayOf(PropTypes.any).isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  stickiesLoading: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const { boardId } = match.params;
  const boards = Boards.find(boardId).fetch()
  const board = boards.length > 0 ? boards[0] : {}

  const stickyHandle = Meteor.subscribe('stickies.inBoard', boardId);

  const stickies = Stickies.find({ boardId }).fetch();

  return {
    stickiesLoading: !(stickyHandle.ready()),
    name: board.name || '',
    stickies,
  };
})(Board);
