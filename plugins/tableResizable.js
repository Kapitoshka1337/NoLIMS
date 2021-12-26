import Vue from 'vue'

export default ({store, context}) => {
  Vue.directive('column-resizable', {
    inserted(el, binding, vnode) {
      let headers = vnode.componentInstance.$children[0].$children[0].$children[1].$options.propsData.headers;
      const nodeName = el.children[1].children[0].nodeName;
      if (['TABLE', 'THEAD'].indexOf(nodeName) < 0) return;

      var tables = document.getElementsByTagName('table');
      let row = tables[0].getElementsByTagName('tr')[0];
      let cols = row ? row.children : undefined;

      if (!cols) return;

      tables[0].style.overflow = 'hidden';

      function setListeners(div) {
        let pageX, curCol, curColWidth, head;

        div.addEventListener('mousedown', function(e) {
          curCol = e.target.parentElement;
          head = headers.filter(h => h.text === curCol.innerText)
          pageX = e.pageX;
          curColWidth = head[0].width;
        });

        document.addEventListener('mousemove', function(e) {
          if (curCol) {
            head[0].width = (curColWidth + (e.pageX - pageX));
          }
        });

        document.addEventListener('mouseup', function(e) {
          curCol = undefined;
          pageX = undefined;
        });
      }

      for (var i = 0; i < cols.length; i++) {
        let div = document.createElement('div');
        div.className = 'column-resizable';
        cols[i].appendChild(div);
        setListeners(div);
      }
    }
  })
}