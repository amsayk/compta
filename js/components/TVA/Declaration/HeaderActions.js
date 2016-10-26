import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

const BUTTONS = [
  'export_xls',
  // 'export_pdf',
];

import LoadingActions from '../../Loading/actions';

const BUTTON_TITLES = {
  export_xls: (intl) => intl.formatMessage(messages['Action_export_xls']),
  export_pdf: (intl) => intl.formatMessage(messages['Action_export_pdf']),
};

function base64ToUint8Array(base64) {
  const raw = atob(base64);
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}

function _handlePrint(base64) {
    require.ensure([], function (require) {
      const FileSaver = require('../../../utils/file-saver');
      FileSaver.saveAs([base64ToUint8Array(base64)], 'Dossier de la TVA.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8');
    }, 'FileSaver');
}

import {
  intlShape,
} from 'react-intl';

import CSSModules from 'react-css-modules';

import styles from './Declaration.scss';

import requiredPropType from 'react-prop-types/lib/all';
import GenExcelMutation from '../../../mutations/GenExcelMutation';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'TVADeclarationHeaderActions';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
    viewer: PropTypes.object.isRequired,
    company: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.company) {
          return new Error('company required!');
        }
      }
    ),
    declaration: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.declaration) {
          return new Error('declaration required!');
        }
      }
    ),
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      topLoading: props.topLoading,
    };
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.topLoading){
    //   return;
    // }

    // this.context.store.dispatch(editStartBill('NEW', [], {id: 'NEW', company: nextProps.company}));
    // this.context.store.dispatch(editStartExpense('NEW', []));
    // this.context.store.dispatch(editStartPayment('NEW', []));

    // this.state = {
    //   modalOpen: true,
    //   modalType: 'bill',
    //   topLoading: nextProps.topLoading,
    // };
  }

  _onSelect = (btn, eventKey, e) => {
    stopEvent(e || eventKey);

    switch (btn){
      case 'export_xls':

        const self = this;

        const { declaration, company, viewer, } = this.props;

        LoadingActions.show();

        Relay.Store.commitUpdate(new GenExcelMutation({
          type: 'VAT',
          objectId: declaration.objectId,
          company: company,
          viewer: viewer,

        }), {
          onSuccess: function ({genExcel: { excel : base64, }}) {
            LoadingActions.hide();

            self.setState({
              modalOpen: false,
              modalType: undefined,
            });

            _handlePrint(base64);
          },
          onFailure: function (transaction) {
            LoadingActions.hide();

            const error = transaction.getError();
            debugger;
          },
        });

        break;

      case 'export_pdf':

      //

        break;

    }

    this.setState({
      modalOpen: true,
      modalType: btn,
    });
  };

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      modalType: undefined,
    });
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    switch (this.state.modalType){
      case 'export_xls':
        return (
          null
        );

      case 'export_pdf':
        return (
          null
        );
    }
  };

  render() {
    const {intl,} = this.context;
    return (
      <div className='header' styleName="header">
        <ButtonToolbar>
          <DropdownButton left styleName='s-btn' bsStyle={'primary'} title={<i style={{verticalAlign: 'middle',marginBottom: 2,}} className="material-icons">settings</i>/*intl.formatMessage(messages['Export'])*/} id={'export'}>
            {BUTTONS.map((btn, index) => <MenuItem key={index}
                                                   onSelect={this._onSelect.bind(this, btn)}
                                                   eventKey={index}>{BUTTON_TITLES[btn](intl)}</MenuItem>)}
          </DropdownButton>
        </ButtonToolbar>
        {this._renderModal()}
      </div>
    );
  }
}
