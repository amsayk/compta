
let message = null;

export function getBeforeUnloadMessage() {
  return message;
}

export function setBeforeUnloadMessage(m) {
 message = m;
}

export function unsetBeforeUnloadMessage() {
 message = null;
}
