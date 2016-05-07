export default function readBlob(blob){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      // const bytes = reader.result;
      // var string = new TextDecoder("utf-8").decode(bytes);
      // var uint8array = new TextEncoder("utf-8").encode(string);
      // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
      // var base64String = btoa([].reduce.call(new Uint8Array(bufferArray),function(p,c){return p+String.fromCharCode(c)},''))
      // function _arrayBufferToBase64( buffer ) {
      //   var binary = '';
      //   var bytes = new Uint8Array( buffer );
      //   var len = bytes.byteLength;
      //   for (var i = 0; i < len; i++) {
      //     binary += String.fromCharCode( bytes[ i ] );
      //   }
      //   return window.btoa( binary );
      // }
//       var handleFileSelect = function(evt) {
//     var files = evt.target.files;
//     var file = files[0];
//
//     if (files && file) {
//         var reader = new FileReader();
//
//         reader.onload = function(readerEvt) {
//             var binaryString = readerEvt.target.result;
//             document.getElementById("base64textarea").value = btoa(binaryString);
//         };
//
//         reader.readAsBinaryString(file);
//     }
// };
      resolve(reader.result);
    });
    reader.readAsArrayBuffer(blob);
  });
}
