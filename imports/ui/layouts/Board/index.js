import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Grid, Row, Col, Panel, Button, ButtonGroup } from 'react-bootstrap';
import { capitalize, filter } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import titleCase from 'title-case';

import { Boards } from '../../../api/boards';
import { Stickies } from '../../../api/stickies';

import BoardSection from '../../components/BoardSection';
import Spinner from '../../components/Spinner';
import CreateSticky from '../../components/CreateSticky';
import BoardWikiMarkup from '../../components/BoardWikiMarkup';
import AccountsUiWrapper from '../../components/AccountsUiWrapper';

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
    Meteor.call('stickies.insert', { body, columnId, boardId });
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
    const {
      name,
      status,
      stickies,
      stickiesLoading,
      user,
      canAdminister,
      allowedStatuses,
    } = this.props;
    const { showStickyDialog } = this.state;
    const { boardId } = this.props.match.params;

    const onStickyCreate = stickyData => this.onStickyCreate({
      columnId: this.state.activeColumn,
      ...stickyData,
    });
    const onStickyDialogClose = () => this.onStickyDialogClose();

    if (!user) {
      const panelHeader = <h2>Login Required</h2>;

      return (
        <Panel header={panelHeader} bsStyle="info">
          <AccountsUiWrapper />
        </Panel>
      );
    }

    const sections = columns.map(columnId => (
      <Col xs={12} sm={6} md={3} key={columnId}>
        <BoardSection
          title={capitalize(columnId)}
          stickies={filter(stickies, { columnId })}
          showAdd={user && status === 'open'}
          stickyBodyReadOnly={status !== 'open'}
          stickyNotesReadOnly={status !== 'discuss'}
          canPlusOne={status==='open'||status==='discuss'}
          onCreateSticky={() => {
            this.setState({
              activeColumn: columnId,
              showStickyDialog: true,
            });
          }}
        />
      </Col>
    ));

    let ownerControls;

    if (canAdminister) {
      const statusButtons = allowedStatuses.map(status => (
        <Button
          key={status}
          bsSize="small"
          onClick={() => {
            Meteor.call('boards.setStatus', boardId, { status });
          }}
        >
          {titleCase(status)}
        </Button>
      ));
      ownerControls = (
        <Row>
          <Col xs={12}>
            <Panel>
              <ButtonGroup>
                {statusButtons}
              </ButtonGroup>
            </Panel>
          </Col>
        </Row>
      )
    }

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>{name}</h2>
            </Col>
          </Row>
          <Row>
            {stickiesLoading ? <Spinner /> : sections}
          </Row>
          {ownerControls}
          <Row>
            <Col xs={12}>
              {stickiesLoading ? '' : <BoardWikiMarkup stickies={stickies} />}
            </Col>
          </Row>
        </Grid>
        <CreateSticky
          show={showStickyDialog}
          onCreate={onStickyCreate}
          onClose={onStickyDialogClose}
          body=""
        />
      </div>
    );
  }
}

Board.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  stickies: PropTypes.arrayOf(PropTypes.any).isRequired,
  match: ReactRouterPropTypes.match.isRequired, // eslint-disable-line react/no-typos
  stickiesLoading: PropTypes.bool.isRequired,
  user: PropTypes.shape({ _id: PropTypes.string }).isRequired,
  allowedStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  canAdminister: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const { boardId } = match.params;
  const boards = Boards.find(boardId).fetch();
  const board = boards.length > 0 ? boards[0] : {};
  const user = Meteor.user();

  const allowedStatuses = board.allowedStatuses ? board.allowedStatuses() : [];

  const stickyHandle = Meteor.subscribe('stickies.inBoard', boardId);

  const stickies = Stickies.find({ boardId }).fetch();

  const canAdminister = user && (board.owner === user._id);

  return {
    stickiesLoading: !(stickyHandle.ready()),
    name: board.name || '',
    status: board.status || '',
    stickies,
    user,
    canAdminister,
    allowedStatuses,
  };
})(Board);
