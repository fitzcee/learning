var DocUtils = (function (ns) {
  
  /**
   * display the items in an element and recurse
   * @param {Element} elem the element
   * @param {number} [indent=0] indentation level (depth)
   * @param {[string]} [textSoFar=[]] the map so far
   * @return {[string]} description of this element and children
   */
  ns.getMap = function (elem, indent, textSoFar) {
    
    // default is no indentation
    indent = indent || 0;
    textSoFar = textSoFar || [];
    
    // get the element type
    var type = elem.getType();
    
    try {
      // not all elements can be cast as text
      var snip = elem.asText().getText().slice(0,20).replace(/\n/g,' ');
    }
    catch(err) {
      var snip = "..no extractable text.."
    }
    
    // accumulate text
    textSoFar.push(new Array(indent+1).join("-") + type + ":" + snip);
  
    // do any children and recurse
    if (elem.getNumChildren) {
      for (var i= 0; i < elem.getNumChildren() ; i++) {
        ns.getMap ( elem.getChild(i) , indent +2, textSoFar);
      }
    }
    
    return textSoFar;
  }

  return ns;
  
}) (DocUtils || {});