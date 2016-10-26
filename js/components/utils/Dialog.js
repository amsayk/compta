/* eslint-disable react/prop-types */
import React, {Component, PropTypes} from 'react';

import styles from './Dialog.scss';

import CSSModules from 'react-css-modules';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'ModalDialog';
  render() {
    return (
      <div className={`modal fade in ${this.props.dialogClassName}`} tabIndex={'-1'} role={'dialog'}>

        <div styleName='trowser'>

          <div styleName='body'>


            <div styleName='flex-stack universal'>

              {this.props.children}

            </div>

          </div>

        </div>

      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class Header extends React.Component {
  render() {
    return (
      <header className={'dialog-header'} styleName='flex-fixed'>

        <div styleName='header table stretch'>

          <div styleName='tableRow'>

            {this.props.children}

          </div>

        </div>

      </header>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class Body extends React.Component {
  static propTypes = {
    scrollable: PropTypes.bool.isRequired,
  }
  static defaultProps = { scrollable: true, };
  render() {
    const { scrollable, } = this.props;
    return (
      <div styleName={scrollable ? 'flex-columns flex-flexible' : ''}>

        <div styleName={scrollable ? 'scroller flex-flexible' : ''}>

          {this.props.children}

        </div>

      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class Footer extends React.Component {
  render() {
    return (
      <footer className={'dialog-footer'} styleName='stickyFooter table width100Percent'>

        <div styleName='tableRow'>

          {this.props.children}

        </div>

      </footer>
    );
  }
}
