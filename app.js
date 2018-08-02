const htmlContent = document.querySelector("#htmlContent");
const vDomContent = document.querySelector("#vDomContent");

function getSufix(id, classNames) {
  return `${id==""?"":'#'+id}${classNames.length>0?'.':''}${classNames.join(".")}`;
}

function go(root, tree) {
  tree.children = tree.children || [];
  tree.tagName = root.tagName.toLowerCase() + getSufix(root.id, root.className.split(" ").filter(e => e.trim() != ''));

  for (var i = 0; i < root.attributes.length; i++) {
    if (['class', 'id'].includes(root.attributes.item(i).name)) {
      continue;
    }
    tree.attr = tree.attr || {};
    tree.attr[root.attributes.item(i).name] = root.attributes.item(i).value;
  }
  
  if (root.childElementCount==0 && root.hasChildNodes()) {
    tree.children.push(root.textContent);
  };

  for (var i = 0; i < root.childElementCount; i++) {
    const node = {
      tagName: 'none',
    };
    go(root.children.item(i), node);
    tree.children.push(node);
  }
}

function stringify(tree) {
  const fn = function(tree, arr) {
    if (typeof(tree)=="string") {
      arr.push(JSON.stringify(tree));
    }else{
      arr.push('h("' + tree.tagName + '"');
          if (tree.attr!=null&&Object.keys(tree.attr).length > 0) {
            arr.push(",");
            arr.push(JSON.stringify(tree.attr));
          }
          if (tree.children!=null && tree.children.length > 0) {
            arr.push(",[");
            tree.children.forEach(e => fn(e, arr));
            arr.push("]");
          }
          arr.push("),")
    }
  };
  const arr = [];
  fn(tree, arr);
  return arr.join('');
}

htmlContent.oninput = data => {
  const parser = new DOMParser();
  const xmlString = `<root>${htmlContent.value}</root>`;
  const xmlDoc = parser.parseFromString(xmlString, "text/html");
  const tree = {};
  go(xmlDoc.getElementsByTagName('root').item(0), tree);
  //const output = JSON.stringify(tree,null,4);
  const output = stringify(tree);
  vDomContent.value = output.split('h(').join('\nh(').split('),]').join(')\n]').split('h("root",[').splice(1).join('').split('\n').splice(1).slice(0, -1).join('\n');
};

htmlContent.value = `<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`;

htmlContent.oninput();