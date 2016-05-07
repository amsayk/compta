import uid from '../../utils/uid';

import faker from 'faker';

type OperationShape = {
  id: string,
  index: number,
  date: Date,
  type: 'Expense' | 'Check',
  refNo: string,
  payee?: ?string,
  category: string,
  total: number,
};

export default class OperationDataListStore {
  constructor(operations:Array<OperationShape>, size:number) {
    this.size = size;
    this._cache = operations;
  }

  static createRowObjectData(index):OperationShape {
    return {
      id: uid.type('Invoice--O'),
      index: index,
      date: faker.date.past(),
      type: faker.random.arrayElement(['Expense' | 'Check']),
      refNo: 1000 + index,
      payee: faker.fake('{{name.firstName}} {{name.lastName}}'),
      category: faker.finance.accountName(),
      total: faker.finance.amount(),
    };
  }

  getObjectAt(index:number):?OperationShape {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = OperationDataListStore.createRowObjectData(index);
    }
    return this._cache[index];
  }

  /**
   * Populates the entire cache with data.
   * Use with Caution! Behaves slowly for large sizes
   * ex. 100,000 rows
   */
  getAll() {
    if (this._cache.length < this.size) {
      for (var i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }
}
