import uid from '../../utils/uid';

import faker from 'faker';

type OperationShape = {
  id: string,
  index: number,
  date: Date,
  type: 'Invoice' | 'Payment' | 'Sales Receipt',
  refNo: string,
  customer?: ?string,
  dueDate: Date,
  bal: number,
  total: number,
  status: 'Closed' | 'Open' | 'Partial' | 'Overdue',
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
      type: faker.random.arrayElement(['Invoice', 'Payment', 'Sales Receipt']),
      refNo: 1000 + index,
      customer: faker.fake('{{name.firstName}} {{name.lastName}}'),
      dueDate: faker.date.future(),
      bal: faker.finance.amount(),
      total: faker.finance.amount(),
      status: faker.random.arrayElement(['Closed', 'Open', 'Partial', 'Overdue']),
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
