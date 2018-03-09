import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class CreateBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.setState({ name: '' });
    }
  }

  handleChange(item, event) {
    this.setState({
      [item]: event.target.value,
    });
  }

  handleSave(event) {
    event.preventDefault();
    const { name } = this.state;
    this.props.onCreate({ name });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { show } = this.props;
    const { name } = this.state;
    const handleNameChange = event => this.handleChange('name', event);
    const handleSave = event => this.handleSave(event);
    const handleClose = event => this.handleClose(event);

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
