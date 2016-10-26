// import moment from 'moment';

export default class OperationDataListStore {
  constructor(declarations) {
    this.size = declarations.length;
    this._cache = declarations;
  }

  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      throw 'IllegalIndexException';
    }

    return this._cache[index];
  }

  get totalVAT(){
    if(this.__totalVAT){
      return this.__totalVAT;
    }

    let amount = 0.0;

    for(let i = 0; i < this.size; i++){
      amount += this._cache[i].VAT;
    }

    this.__totalVAT = amount;

    return amount;
  }

  get totalHT(){

    if(this.__totalHT){
      return this.__totalHT;
    }

    let amount = 0.0;

    for(let i = 0; i < this.size; i++){
      amount += this._cache[i].amount;
    }

    this.__totalHT = amount;

    return amount;
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
