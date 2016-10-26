const formatError = require('../utils').formatError;

const FileClass = require('../types').File;

module.exports.delFile = function delFile(request, response) {
  const File = FileClass({id: request.params.companyId,});

  function handleError(error) {
    response.error(formatError(error));
  }

  const q = new Parse.Query(File);
  q.get(request.params.id).then(file => {

    return file.destroy().then(function () {
      response.success({deletedFileId: file.id,});
    }, handleError);
  });
}
