import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, FormControl, Checkbox, Button, Form } from 'react-bootstrap';
import { isEmpty } from 'lodash';

class CreateSticky extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: props.body,
      notes: props.notes,
      showAvatar: props.showAvatar,
      showAvatarCheckbox: isEmpty(props.body),
    };
  }

  static get propTypes() {
    return {
      show: PropTypes.bool.isRequired,
      onCreate: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
      body: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
      showAvatar: PropTypes.bool.isRequired,
      showNotes: PropTypes.bool.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.setState({
        body: nextProps.body,
        notes: nextProps.notes,
        showAvatar: nextProps.showAvatar,
        showAvatarCheckbox: isEmpty(nextProps.body),
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
    const { body, notes } = this.state;
    this.props.onCreate({ body, notes });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { show, showNotes, showAvatar } = this.props;
    const { body, notes, showAvatarCheckbox } = this.state;
    const handleBodyChange = event => this.handleChange('body', event);
    const handleNotesChange = event => this.handleChange('notes', event);
    const handleShowAvatarChange = event => this.handleChange('showAvatar', event);
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
                componentClass="textarea"
                value={body}
                placeholder="Enter Text"
                onChange={handleBodyChange}
              />
            </FormGroup>
            {showNotes ?
              <FormGroup>
                <ControlLabel>Notes/Action Items</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder="Enter text"
                  value={notes}
                  onChange={handleNotesChange}
                />
              </FormGroup>
              : null}
            {showAvatarCheckbox ?
              <FormGroup>
                <Checkbox checked={showAvatar}>
                  Show My Avatar
                </Checkbox>
              </FormGroup>
              : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateSticky;
