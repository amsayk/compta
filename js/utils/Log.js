/*
*
* @providesModule Log
*
* */

export function logInfo(...messages) {
  if (process.env.NODE_ENV !== 'production') {
    return console.log(...messages);
  }
}
