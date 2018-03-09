import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Alert, Panel, ListGroup, ListGroupItem, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import moment from 'moment';

import { Boards } from '../../../api/boards';

import CreateBoard from '../../components/CreateBoard';
import Spinner from '../../components/Spinner';
import AccountsUiWrapper from '../../components/AccountsUiWrapper';

import {styles} from './style.scss';

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showCreateDialog: false };
  }

  static get propTypes() {
    return {
      boards: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
      listLoading: PropTypes.bool.isRequired,
      user: PropTypes.shape({ _id: PropTypes.string }),
    };
  }

  static get defaultProps() {
    return {
      user: null,
    };
  }

  handleBoardCreate({ name }) {
    Meteor.call('boards.insert', name);
    this.setState({ showCreateDialog: false });
  }

  handleBoardCreateClose() {
    this.setState({ showCreateDialog: false });
  }

  render() {
    const { boards, listLoading, user } = this.props;
    const { showCreateDialog } = this.state;

    let boardList;
    if (listLoading) {
      boardList = (
        <Spinner />
      );
    } else if (!user) {
      if (!user) {
        const panelHeader = <h2>Login Required</h2>;

        return (
          <Panel header={panelHeader} bsStyle="info">
            <AccountsUiWrapper />
          </Panel>
        );
      }
    } else if (boards.length === 0) {
      boardList = (
        <Alert bsStyle="info">
          No boards have been created. Create your first one below!
        </Alert>
      );
    } else {
      const boardListItems = boards.map(({ _id, name, createdAt }) => (
        <LinkContainer to={`/boards/${_id}`} key={_id}>
          <tr className={styles.boardRow}>
            <td>
              {name}
            </td>
            <td>
              {createdAt ? moment(createdAt).format('ll') : ''}
            </td>
          </tr>
        </LinkContainer>
      ));

      const panelHeader = (
        <div>
          <h3>Boards</h3>
          <p>Click on a board below to load it.</p>
        </div>
      );

      boardList = (
        <Panel header={panelHeader}>
          <Table fill hover>
            <tbody>
              {boardListItems}
            </tbody>
          </Table>
        </Panel>
      );
    }

    const makeBoard = () => this.setState({ showCreateDialog: true });
    const handleBoardCreate = newBoardProps => this.handleBoardCreate(newBoardProps);
    const handleBoardClose = newBoardProps => this.handleBoardCreateClose(newBoardProps);

    return (
      <div className={styles.boardList}>
        {boardList}
        {listLoading || !user ? '' : <Button onClick={makeBoard}>Create New Board</Button>}
        <CreateBoard
          show={showCreateDialog}
          onCreate={handleBoardCreate}
          onClose={handleBoardClose}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  const handle = Meteor.subscribe('boards');
  const user = Meteor.user();

  return {
    listLoading: !handle.ready(),
    boards: Boards.find({}, { sort: { createdAt: -1 } }).fetch(),
    user,
  };
})(BoardList);
