document
  .getElementsByTagName("head")[0]
  .insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="ie.css" type="text/css" />'
  );

//@ts-ignore
window.cssVars();
