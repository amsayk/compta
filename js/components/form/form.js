import React, {Component} from 'react';

import CSSModules from 'react-css-modules';

import styles from './form.scss';

import events from 'dom-helpers/events';

import classnames from 'classnames';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

const messages = defineMessages({

  MONTHLY: {
    id: 'MONTHLY',
    description: '',
    defaultMessage: 'MONTHLY'
  },

  TRIMESTERLY: {
    id: 'TRIMESTERLY',
    description: '',
    defaultMessage: 'TRIMESTERLY'
  },

});

@CSSModules(styles, {allowMultiple: true})
export class Text extends Component {
  render() {
    const {name, description, placeholder, autoFocus, props,} = this.props;
    return (
      <div styleName="field">

        <div styleName="left" style={{width:'50%'}}>
          <div styleName="label centered" style={{padding:'0 24px'}}>
            <div styleName="text">{name}</div>
            {description && !(props.error && props.touched && !props.pristine) ?
              <div styleName="description">{description}</div> : null}
            {props.error && props.touched && !props.pristine && <div className="text-danger">{props.error}</div>}
          </div>
        </div>

        <div styleName="right" style={{marginLeft:'50%'}}>
          <input className={props.error && props.touched && !props.pristine ? 'text-danger' : ''}
                 autoFocus={autoFocus} {...props} type="text" styleName="text_input" style={{height:'80px'}}
                 placeholder={placeholder}/>
        </div>

      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export class Select extends Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };
  state = {
    open: false
  };
  _toggle = () => {
    this.setState({
      open: !this.state.open
    })
  };
  _hide = (e) => {
    //if(!e.target.classList.contains(this.props.styles.option)){
    //  this.setState({
    //    open: false
    //  });
    //}

     if (this.refs.dropdown && !this.refs.dropdown.contains(e.target)) {
      this.setState({
        open: false
      });
     }
  };

  componentWillReceiveProps() {
    // this._hide()
  }

  componentDidMount() {
    events.on(document, 'click', this._hide, true);
  }

  componentWillUnmount() {
    events.off(document, 'click', this._hide, true);
  }

  dropdownClickHandler = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  };

  render() {
    const {formatMessage,} = this.context.intl;
    const {name, description, values, props,} = this.props;

    const onChange = (e, value) => {
      e.nativeEvent.stopImmediatePropagation();
      props.onChange(value);
      this._toggle();
    };

    const _renderValues = () => {

      if (this.state.open) {

        return (
          <div style={{overflow: 'hidden', transition: 'all .5s cubic-bezier(1,0,0,1)', }}>

            <div ref="dropdown" className={classnames({'clearfix select-dropdown': true, open: this.state.open})} onClick={this.dropdownClickHandler}>

              <div className={`dropdown-menu ${this.props.styles.menu}`}>
                {values.map(([value, displayName]) => {
                  return (
                    //<MenuItem
                    //  // {...props}
                    //  active={value === props.value}
                    //  onSelect={(e) => {
                    //    e.preventDefault();
                    //    e.stopPropagation();
                    //    props.onChange(value)
                    //  }}
                    //  onClick={(e) => {
                    //    e.preventDefault();
                    //    e.stopPropagation();
                    //  }}
                    //  eventKey={value}
                    //  key={value}>
                    //
                    //  <div className="option">{displayName}
                    //  </div>
                    //
                    //</MenuItem>

                    <a key={value} onClick={(e) => onChange(e, value)} className={''}>
                      <div className={this.props.styles.option}>{displayName}</div>
                    </a>

                  );
                })}
              </div>

            </div>

          </div>
        );
      }

      return (
        <div className={this.props.styles.dropdown} onClick={this._toggle}>
          <div className={this.props.styles.current}>
            <div className={this.props.styles.option}>{formatMessage(messages[props.value || props.defaultValue])}</div>
          </div>
        </div>
      );
    };

    return (
      <div styleName="field">

        <div styleName="left" style={{width:'50%'}}>
          <div styleName="label centered" style={{padding:'0 24px'}}>
            <div styleName="text">{name}</div>
            {description && !(props.error && props.touched && !props.pristine) ?
              <div styleName="description">{description}</div> : null}
            {props.error && props.touched && !props.pristine && <div className="text-danger">{props.error}</div>}
          </div>
        </div>

        <div styleName="right" style={{marginLeft:'50%'}}>

          {_renderValues()}

        </div>

      </div>
    );
  }
}
