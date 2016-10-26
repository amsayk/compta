import readBlob from './readBlob';

export default function readBase64(blob){
  return readBlob(blob).then(function (data) {
    return btoa([].reduce.call(new Uint8Array(data),function(p,c){return p+String.fromCharCode(c)},''));
  });
}
