'use strict';

import React from 'react';

import Title from '../Title/Title';

import Button from 'react-bootstrap/lib/Button';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import Alert from '../Alert/Alert';

import throttle from 'lodash.throttle';

import styles from './Wizard.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../utils/Dialog';

import Step from './Step';

import events from 'dom-helpers/events';

import classnames from 'classnames';

@CSSModules(styles, {allowMultiple: true})
export default class Wizard extends React.Component{

  static displayName = 'Wizard';

  static propTypes = {
  };

  _getCurrentStepContext(){
    return this._currentStepContext || this;
  }

  onSubmit(){
    const self = this;
    this.setState({
      advanceDisabled: true,
      retreatDisabled: true
    }, function(){

      const step = self.props.steps[self.state.currentStep];

      step.onSubmit.apply(self._getCurrentStepContext(), [self.advance, self.stay]);
    });

  }
  onDone(){
    const step = this.props.steps[this.state.currentStep];

    step.onDone.apply(this._getCurrentStepContext());
  }
  onBack(){
    const step = this.props.steps[this.state.currentStep];

    if(step.onBack){
      step.onBack.apply(this._getCurrentStepContext(), [this.retreat]);
    }else{
      this.retreat();
    }
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      currentStep: this.props.start || 0,
      currentError: null,
      data: {...this.props},
      advanceDisabled: false,
      retreatDisabled: false,
    };

    this._getCurrentStepContext = this._getCurrentStepContext.bind(this);

    this.retreat = this.retreat.bind(this);
    this.advance = this.advance.bind(this);
    this.stay = this.stay.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onDone = this.onDone.bind(this);
    this.onBack = this.onBack.bind(this);

    // this.onClose = this.onClose.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  advance(err){
    if(err){
      this.setState({
        // advanceDisabled: true,
        // retreatDisabled: true,
        advanceDisabled: false,
        retreatDisabled: false,
        currentError: err,
      });
    }else{
      this.setState({
        advanceDisabled: false,
        retreatDisabled: false,
        currentError: null,
        currentStep: this.state.currentStep + 1,
      });
    }
  }
  stay(err){
    this.setState({
      advanceDisabled: false,
      retreatDisabled: false,
      currentError: err,
    });
  }
  retreat(){
    var self = this;
    self.setState({
      advanceDisabled: false,
      retreatDisabled: false,
      currentError: null,
      currentStep: self.state.currentStep - 1,
    });
  }

  static defaultProps = {
    steps: [],
  };

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);

    ga('send', 'pageview', '/modal/app/multiStep');
  }

  componentWillUnmount() {
    // unsetBeforeUnloadMessage();
    events.off(window, 'resize', this._handleWindowResize);
  }

  // onClose() {
  //   this.props.onRequestHide && this.props.onRequestHide();
  // }

  getClassName(className, i){

    let clName;

    if(i === this.state.currentStep){
      clName = 'doing';
    }
    if(i < this.state.currentStep){
      clName = 'done';
    }
    if(i > this.state.currentStep){
      clName = 'todo';
    }

      return className + '-' + clName;
    }

  renderSteps() {
    const steps = [];
    for(let i = 0,len = this.props.steps.length - 1; i < len; i++){
      steps.push(
        <li className={this.getClassName('progtrckr', i)} key={i} value={i}>
          <em>{i+1}</em>
          <span>{this.props.steps[i].title}</span>
        </li>
      );
    }
    return steps;
  }

  onCancel(){
    this.props.onRequestHide(undefined, false);
  }

  render() {

    const self = this;

    const { styles, } = this.props;

    const step = this.props.steps[this.state.currentStep];

    const firstStep = this.state.currentStep === 0;
    const lastStep = this.state.currentStep === (this.props.steps.length - 1);

    let AdvanceButton;
    if(lastStep){
      if(step.onDone){
        AdvanceButton = React.createElement(Button, {
          onClick: this.onDone,
          className: classnames(`${styles.next} ${styles.btn} ${styles.primary}`, {}),
          bsStyle: 'primary'
        }, 'Fermer');
      }

    }else{
      AdvanceButton = React.createElement(Button, {
        onClick: this.onSubmit,
        className: classnames(`${styles.next} ${styles.btn} ${styles.primary}`, {}),
        disabled: this.state.advanceDisabled,
        bsStyle: 'primary',
      }, 'Suivant');
    }

    let RetreatButton;
    if(!lastStep && !firstStep){
      RetreatButton = React.createElement(Button, {
        onClick: this.onBack,
        className: classnames(`${styles.prev} ${styles.btn} ${styles.dark}`, {}),
        disabled: firstStep || this.state.retreatDisabled,
      }, 'Précédent');
    }

    let CancelButton;
    if(firstStep){
      CancelButton = React.createElement(Button, {
        onClick: this.onCancel,
        className: classnames(`${styles.cancel} ${styles.btn} ${styles.dark}`, {}),
      }, 'Annuler');
    }

    const Component = React.createElement(Step, {
      key: 'step-' + this.state.currentStep,
      component: step.component,
      currentError: this.state.currentError,
      data: this.state.data,
      onRef: (step) => { this._currentStepContext = step; },
      stepProps: this.props.stepProps,
    });

    return (
      <Modal dialogClassName={`${styles['modal']} wizard`}
             dialogComponentClass={Dialog}
             className={classnames('wizard form modal-fullscreen', {
               [this.props.className || '']: true,
             })}
             show={true} keyboard={false} backdrop={false} onHide={undefined} autoFocus enforceFocus>

        {lastStep || <Header style={{ backgroundColor:'#ffffff', height: 45, padding: '7px 16px', }}>

          <div styleName='tableCell'>

            <ol className='progtrckr'>
              {this.renderSteps()}
            </ol>

          </div>

        </Header>}

        <Body className={classnames('step', {
          'first-step': firstStep,
          'last-step': lastStep,
          'step-has-error': this.state.currentError,
        })}>

          <div styleName='stretch'>

            <div styleName='tableCell'>

              <div>

                <div className='the-container table' style={{}}>

                    <div style={{}}>

                      {Component}

                    </div>

                  </div>

                </div>

            </div>

          </div>

        </Body>

        <Footer>

          {CancelButton && <div styleName='tableCell' style={{textAlign: 'left'}}>

            <ButtonToolbar>

              {CancelButton}

            </ButtonToolbar>

          </div>}

          <div styleName='tableCell' style={{textAlign: 'right'}}>

            <ButtonToolbar>

              {RetreatButton}

              {AdvanceButton}

            </ButtonToolbar>

          </div>

        </Footer>

        {this.props.title && <Title title={this.props.title}/>}

      </Modal>
    );
  }
}
