function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}

loadJS('/js/Physics/geometries/circle.js')
loadJS('/js/Physics/geometries/compound.js')
loadJS('/js/Physics/geometries/convex-polygon.js')
loadJS('/js/Physics/geometries/rectangle.js')