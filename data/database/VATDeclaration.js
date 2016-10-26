const Parse = require('parse');

module.exports = company => {

  const name = `VATDeclaration_${company.id}`;

  class VATDeclaration extends Parse.Object {
    __type = 'VATDeclaration';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, VATDeclaration);

  return VATDeclaration;
}
