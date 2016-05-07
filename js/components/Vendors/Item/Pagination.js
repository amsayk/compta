import React, {Component, PropTypes} from 'react';

import styles from './Pagination.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../../utils/stopEvent';

import Paginate from 'react-paginate';

import shallowEqual from 'shallowEqual';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'ExpensesPagination';
  static propTypes = {
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
  };
  static contextTypes = {

  };

  constructor(props, context){
    super(props, context);
    this.state = {
      offset: this.props.offset,
      count: this.props.count,
      totalCount: this.props.totalCount,
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.offset !== this.state.offset || nextProps.totalCount !== this.state.totalCount || nextProps.count !== this.state.count){
      this.setState({
        offset: nextProps.offset,
        count: nextProps.count,
        totalCount: nextProps.totalCount,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !shallowEqual(this.state, nextState);
  }

  handlePageClick = ({selected}) => {
    const offset = Math.ceil(selected * this.props.limit);

    this.setState({offset: offset}, () => {
      this.props.onPage(offset);
    });
  };
  render(){
    const { styles, count, totalCount, limit, offset, } = this.props;
    const pageNum = Math.ceil(totalCount / limit);
    const selected = offset / limit;
    return (
      <div styleName={'paginate'}>

        <div styleName='inline-block left' style={{}}>
          {offset + 1} à {offset + count} de {totalCount}
        </div>

        <div styleName='inline-block right' style={{ verticalAlign: 'middle', }}>

          <Paginate previousLabel={<i className={'material-icons'}>chevron_left</i>}
                     nextLabel={<i className={'material-icons'}>chevron_right</i>}
                     breakLabel={<li className='break'><a href=''>…</a></li>}
                     pageNum={pageNum}
                     forceSelected={selected}
                     marginPagesDisplayed={2}
                     pageRangeDisplayed={5}
                     disabledClassName={'disabled'}
                     clickCallback={this.handlePageClick}
                     containerClassName={`${styles['pages']} ${styles['pagination']}`}
                     subContainerClassName={`${styles['pages']} ${styles['pagination']}`}
                     activeClassName={'active'} />

        </div>

      </div>
    );
  }
}
