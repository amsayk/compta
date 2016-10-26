import React, {} from 'react';

export default ({viewer, onClick, styles}) => (
  <div className={styles.header}>
    <a className={`${styles.logo}`} onClick={onClick.bind(this, "/apps")}><i className="sidebar-logo material-icons md-light">
      account_balance_wallet</i><span className='sidebar-logo-text'>Compta</span>
    </a>
    {/*<div className={styles.account}>
     <a className="" onClick={onClick.bind(this, "/account")}>{viewer.email}</a>
     </div>*/}
    <div className={`${styles.right} sidebar-header-account`} style={{cursor: 'pointer'}}>
      {/*<i onClick={onClick.bind(this, "/account")} className="material-icons">account_circle</i>*/}
      <i onClick={onClick.bind(this, "/account")} className="material-icons">settings</i>
    </div>
  </div>
)
