import React, { Component, PropTypes, } from 'react';
import Relay from 'react-relay';

import stopEvent from '../../../utils/stopEvent';

import UpdateVendorNotesMutation from '../../../mutations/UpdateVendorNotesMutation';

const ENTER_KEY_CODE = 13;

import classnames from 'classnames';

import CSSModules from 'react-css-modules';

import styles from './NotesEditor.scss';

const Status = {
  Saving: 1,
  Error: 2,
  Saved: 3,
  Indeterminate: 3,
};

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'NotesEditor';
  static propTypes = {
    payee: PropTypes.object.isRequired,
  };
  constructor(props, context){
    super(props, context);

    this.state = {
      status: Status.Indeterminate,
      editing: false,
      value: this.props.payee.notes,
    };
  }
  componentWillReceiveProps(nextProps){
    if(this.state.status === Status.Saving){
      return;
    }

    if(this.state.value !== nextProps.payee.notes){
      this.setState({
        value: nextProps.payee.notes,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return nextState.value !== this.state.value || this.state.editing !== nextState.editing || nextProps.payee.notes !== this.props.payee.notes;
  }
  render(){
    const { value, editing, status, } = this.state;
    return (
      <div styleName='stage-notes'>

        {editing || <div styleName='stage-view-notes'>
          {typeof value === 'undefined' || value === null && <a onClick={this._startEditing} styleName='notes-add' style={{}}>Ajouter des notes</a>}
          {value && value.length > 0 && <div title={'Click to edit.'} styleName='notes-view' onClick={this._startEditing}>{value}</div>}
        </div>}

        {editing && <textarea
          autoComplete='off'
          styleName='notes-input'
          tabIndex='0'
          maxLength='4000'
          placeholder='Ajouter des notes'
          onBlur={this._save}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          autoFocus={true}
          style={{ padding: 8, }}
          value={value || ''}>
        </textarea>}

        {<div styleName={classnames('notes-status', { 'notes-status-success': status === Status.Saved, 'notes-status-error': status === Status.Error, 'notes-status-saving': status === Status.Saving,  })}>{function(){
          switch (status) {
            case Status.Indeterminate: return null;
            case Status.Saving:        return 'Saving...';
            case Status.Saved:         return 'Successfully saved.';
            case Status.Error:         return 'An error occured.';
          }
        }()}</div>}

      </div>
    );
  }

  _startEditing = (e) => {
    stopEvent(e);

    this.setState({
      editing: true,
    });
  }

  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
  _save = () => {
    if(this.state.value === this.props.payee.notes){
      this.setState({
        editing: false,
      });
      return;
    }

    this.setState({
      status: Status.Saving,
    }, () => {

      // do save here
      Relay.Store.commitUpdate(new UpdateVendorNotesMutation({
        id: this.props.payee.id,
        notes: this.state.value,
        sessionToken: this.props.viewer.sessionToken,
        vendor: this.props.payee,
        company: this.props.company,
        viewer: this.props.viewer,
      }), {
        onSuccess:  ({updateVendorNotes: {vendor: { id, notes, }}}) => {
          this.setState({
            status: Status.Saved,
            editing: false,
            value: notes,
          });
        },
        onFailure:  (transaction) => {
          const error = transaction.getError();
          this.setState({
            status: Status.Error,
            error,
          });
        },
      });
    });
  };

  /**
   * @param {object} event
   */
  _onChange = (/*object*/ event) => {
    this.setState({
      value: event.target.value
    });
  };

  /**
   * @param  {object} event
   */
  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      stopEvent(event);
      this._save();
    }
  };

}
