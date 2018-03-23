import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, FormControl, Button, Form } from 'react-bootstrap';
import { capitalize } from 'lodash';

import columns from '../../util/columns';

class MoveSticky extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnId: props.columnId,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.setState({
        columnId: nextProps.columnId,
      });
    }
  }

  handleChange(item, event) {
    this.setState({
      [item]: event.target.value,
    });
  }

  handleSave(event) {
    event.preventDefault();
    const { columnId } = this.state;
    this.props.onMove({ columnId });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { show } = this.props;
    const { columnId } = this.state;
    const handleColumnChange = event => this.handleChange('columnId', event);
    const handleSave = event => this.handleSave(event);
    const handleClose = event => this.handleClose(event);

    const columnOptions = columns.map(columnKey => (
      <option key={columnKey} value={columnKey}>
        {capitalize(columnKey)}
      </option>
    ));

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Move Sticky</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <FormGroup>
              <ControlLabel>Column</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="Column"
                onChange={handleColumnChange}
                value={columnId}
              >
                {columnOptions}
              </FormControl>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

MoveSticky.propTypes = {
  show: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  columnId: PropTypes.string.isRequired,
};

export default MoveSticky;
