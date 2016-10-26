export default class OperationDataListStore {
  constructor({customers, count}) {
    this.size = count;
    this._cache = customers;
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
