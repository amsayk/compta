import React, {} from 'react';

export default ({viewer, onClick, styles}) => (
  <div className={styles.header}>
    <a className={styles.logo} onClick={onClick.bind(this, "/apps")}><i className="material-icons md-light">
      account_balance_wallet</i>Compta
    </a>
    <div className={styles.account}>
      <a className="" onClick={onClick.bind(this, "/account")}>{viewer.email}</a>
    </div>
  </div>
)
