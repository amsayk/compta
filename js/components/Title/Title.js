import React, {Component, PropTypes} from 'react';

// import config from '../../config';
import Helmet from 'react-helmet';

import {
  intlShape,
} from 'react-intl';

export default class extends Component {
  static displayName = 'Title';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps){
    return this.props.title !== nextProps.title;
  }

  state = {
  };

  render() {
    const { intl, } = this.context;
    const { title, } = this.props;
    return (
      <Helmet title={title}/>
    );
  }
}
