'use strict';

import React from 'react';

import styles from './Wizard.scss';

import CSSModules from 'react-css-modules';

import Alert from '../Alert/Alert';

@CSSModules(styles, {allowMultiple: true})
export default class Step extends React.Component{
  static displayName = 'WizardStep';

  static propTypes = {
  };

  render(){
    const { styles, stepProps = {}, } = this.props;

    const ComponentClass = this.props.component;

    let Error;
    if(this.props.currentError){
      Error = <Alert title={'Erreur'} type={'error'}>
                <p>{this.props.currentError.message}</p>
              </Alert>;
    }

    return (
      <div style={{}}>

        {Error}

        <ComponentClass
          onRef={this.props.onRef}
          error={Error}
          data={this.props.data}
          onAdvance={this.onAdvance}
          onBack={this.onBack}
          {...stepProps}
        />

      </div>
    );
  }
}
