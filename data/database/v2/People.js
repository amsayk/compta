const Parse = require('parse');

module.exports = company => {

  const name = `People_${company.id}`;

  class People extends Parse.Object {

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, People);

  return People;
}
