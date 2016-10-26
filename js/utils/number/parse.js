// const Globalize = require('../globalize');
//
// const numberParser = Globalize( window.__locale ).numberParser();
//
// export default numberParser;

export default (function(){

  const settings = {
    separator: ' '
    , decimal: ','
    , errorOnInvalid: false
  };

  return function parseNumber(value){

    let v = 0;

    if (typeof value === 'number') {
      v = value * 100;
    } else if (typeof(value) === 'string') {
      const regex = new RegExp('[^-\\d' + settings.decimal + ']', 'g');
      const decimal = new RegExp('\\' + settings.decimal, 'g');
      v = parseFloat(
            value
              .replace(/\((.*)\)/, '-$1') // allow negative e.g. (1.99)
              .replace(regex, '')         // replace any non numeric values
              .replace(decimal, '.')      // convert any decimal values
              * 100                       // scale number to integer value
          );
      v = isNaN(v) ? 0 : v;
    } else {
      if(settings.errorOnInvalid) {
        throw Error('Invalid Input');
      }
      v = 0;
    }

    return v / 100;
  };

})();
