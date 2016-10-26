const Parse = require('parse');

module.exports = company => {

  const name = `File_${company.id}`;

  class File extends Parse.Object {
    __type = 'File';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, File);

  return File;
}
