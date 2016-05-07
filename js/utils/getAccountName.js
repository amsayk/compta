import ACCOUNTS from '../../data/database/accounts';

export default function getAccountName(code){
  return ACCOUNTS[code].name;
}
