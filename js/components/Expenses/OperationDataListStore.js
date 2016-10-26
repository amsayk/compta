// import ACCOUNTS from '../../../data/database/accounts';
// import CATEGORIES from '../../../data/database/categories';

export default class OperationDataListStore {
  constructor({expenses}) {
    this.size = expenses.length;
    this._cache = expenses;

    // this._cache.sort(mostRecentSort(obj => obj.refNo));
  }

  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      throw 'IllegalIndexException';
    }

    return this._cache[index];
  }

  /**
   * Populates the entire cache with data.
   * Use with Caution! Behaves slowly for large sizes
   * ex. 100,000 rows
   */
  getAll() {
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }
}
