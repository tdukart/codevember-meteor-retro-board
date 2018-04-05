import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { map } from 'lodash';

import columnSets from '../../util/columnSets';

class CreateBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      columnSet: 'ssc',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.setState({ name: '', columnSet: 'ssc' });
    }
  }

  handleChange(item, event) {
    this.setState({
      [item]: event.target.value,
    });
  }

  handleSave(event) {
    event.preventDefault();
    const { name, columnSet } = this.state;
    this.props.onCreate({ name, columnSet });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { show } = this.props;
    const { name, columnSet } = this.state;
    const handleNameChange = event => this.handleChange('name', event);
    const handleColumnSetChange = event => this.handleChange('columnSet', event);
    const handleSave = event => this.handleSave(event);
    const handleClose = event => this.handleClose(event);

    const columnSetItems = Object.keys(columnSets).map(key => (
      <option key={key} value={key}>
        {map(columnSets[key], 'name').join('/')}
      </option>
    ));

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave}>
            <FormGroup>
              <ControlLabel>Board Name</ControlLabel>
              <FormControl
                type="text"
                value={name}
                placeholder="Enter Name"
                onChange={handleNameChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Columns</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="Columns"
                onChange={handleColumnSetChange}
                value={columnSet}
              >
                {columnSetItems}
              </FormControl>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CreateBoard.propTypes = {
  show: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateBoard;
