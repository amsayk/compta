export function getBodyHeight() {
  var body = document.body,
    html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

  return height;
}

export function getBodyWidth() {
  var body = document.body,
    html = document.documentElement;

  var width = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);

  return width;
}

export function getScrollTop(w) {
  w = w || window;

  // fireFox property
  if (typeof(w.pageYOffset) == 'number') {
    return w.pageYOffset;
  }

  if (w.document.documentElement && w.document.documentElement.scrollTop) {
    return w.document.documentElement.scrollTop;
  }

  if (w.document.body && w.document.body.scrollTop) {
    return w.document.body.scrollTop;
  }

  return 0;
}

export function getScrollLeft(w) {
  w = w || window;

  // fireFox property
  if (typeof(w.pageXOffset) == 'number') {
    return w.pageXOffset;
  }

  if (w.document.documentElement && w.document.documentElement.scrollLeft) {
    return w.document.documentElement.scrollLeft;
  }

  if (w.document.body && w.document.body.scrollLeft) {
    return w.document.body.scrollLeft;
  }

  return 0;
}
