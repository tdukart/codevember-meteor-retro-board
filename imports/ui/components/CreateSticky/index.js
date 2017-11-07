import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, FormControl, Button, Form } from 'react-bootstrap';

class CreateBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
    };
  }

  static get propTypes() {
    return {
      show: PropTypes.bool.isRequired,
      onCreate: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.setState({ body: '' });
    }
  }

  handleChange(item, event) {
    this.setState({
      [item]: event.target.value,
    });
  }

  handleSave(event) {
    event.preventDefault();
    const { body } = this.state;
    this.props.onCreate({ body });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { show } = this.props;
    const { body } = this.state;
    const handleBodyChange = event => this.handleChange('body', event);
    const handleSave = event => this.handleSave(event);
    const handleClose = event => this.handleClose(event);

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Sticky</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <FormGroup>
              <ControlLabel>Sticky Text</ControlLabel>
              <FormControl
                type="text"
                value={body}
                placeholder="Enter Text"
                onChange={handleBodyChange}
              />
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

export default CreateBoard;
