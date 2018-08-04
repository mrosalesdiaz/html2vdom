const htmlContent = document.querySelector("#htmlContent");
const vDomContent = document.querySelector("#vDomContent");

/**
 * taken from: https://gist.github.com/sstur/7379870
 **/
function toJSON(node) {
  node = node || this;
  var obj = {
    nodeType: node.nodeType
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else
  if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  var attrs = node.attributes;
  if (attrs) {
    var length = attrs.length;
    var arr = obj.attributes = new Array(length);
    for (var i = 0; i < length; i++) {
      attr = attrs[i];
      arr[i] = [attr.nodeName, attr.nodeValue];
    }
  }
  var childNodes = node.childNodes;
  if (childNodes) {
    length = childNodes.length;
    arr = obj.childNodes = new Array(length);
    for (i = 0; i < length; i++) {
      arr[i] = toJSON(childNodes[i]);
    }
  }
  return obj;
}

function stringify(tree) {
  console.log(tree);
  let counter = 0;
  const buildId = (node, attr) => `${node.tagName}${attr.filter(e=>e[0]=='id').map(e=>`#${e[1]}`).pop()||''}${(attr.filter(e=>e[0]=='class').map(e=>e[1].split(' ').filter(i=>i.trim()!=='').map(i=>`.${i.trim()}`)).pop()||[]).join('')}`;
  const buildAttributes= attr=>{
    const ret=attr
      .filter(e=>!['id','class'].includes(e[0]))
      .reduce((prev,curr)=>{
        prev[curr[0]]=curr[1];
        return prev},{}); 
      return `,${JSON.stringify(ret)}`;
  };

  const fn = (tree, arr) => {
    if ((++counter) > 1000) return;

    if (tree.nodeName === '#text') {
      if (tree.nodeValue.trim() !== '') {
        arr.push(`,${JSON.stringify(tree.nodeValue)}`);  
      }
    } else {
      arr.push(`,h("${buildId(tree,tree.attributes)}"`);
      if (tree.attributes.filter(e=>!['id','class'].includes(e[0])).length>0) {
        arr.push(`${buildAttributes(tree.attributes)}`);
      }
      arr.push(`,[`);
      const afterLastIndex=arr.length;
      tree.childNodes.forEach(treeChild => {
        fn(treeChild, arr);
      });
      if (afterLastIndex<arr.length) {
        arr[afterLastIndex]=arr[afterLastIndex].substring(1);
      }
      arr.push(`])`);
    }
  };

  const tokens = [];
  fn(tree, tokens);
  const output=tokens.join('');
  return output.substring(output.indexOf('[')+1,output.lastIndexOf(']')).trim();
}

function format(string){
  /*let test=string
    .split(',[')
    .join(',[\n')
    .split('])')
    .join('\n])\n')
    .split(',h')
    .join(',\nh');
*/
  return string;
}

htmlContent.oninput = data => {
  const parser = new DOMParser();
  const xmlString = `<root>${htmlContent.value}</root>`;
  const xmlDoc = parser.parseFromString(xmlString, "text/html");
  const tree = toJSON(xmlDoc.getElementsByTagName('root').item(0));

  const output = stringify(tree);
  vDomContent.value = format(output); 
};

htmlContent.value = `<div id="container" class="app-text" onclick="test">TextTest<span>Smple</span>The End</div>`;

htmlContent.oninput();