import Vue from 'vue'

export default ({store, context}) => {
    Vue.directive('columns-resizable', {
        inserted(el) {
        //   debugger
          const nodeName = el.children[1].children[0].nodeName;
          if (['TABLE', 'THEAD'].indexOf(nodeName) < 0) return;
    
          const table = nodeName === 'TABLE' ? el : el.parentElement;
          const thead = table.querySelector('thead');
          const ths = thead.querySelectorAll('th');
          const barHeight = nodeName === 'TABLE' ? table.offsetHeight : thead.offsetHeight;
    
          var tables = document.getElementsByTagName('table');
          for (var i=0; i<tables.length;i++){
           resizableGrid(tables[i]);
          }
          
          function resizableGrid(table) {
           var row = table.getElementsByTagName('tr')[0],
           cols = row ? row.children : undefined;
           if (!cols) return;
           
           table.style.overflow = 'hidden';
           
           var tableHeight = table.offsetHeight;
           
           for (var i=0;i<cols.length;i++){
            var div = createDiv(tableHeight);
            cols[i].appendChild(div);
            cols[i].style.position = 'relative';
            setListeners(div);
           }
          
           function setListeners(div){
            var pageX,curCol,nxtCol,curColWidth,nxtColWidth;
          
            div.addEventListener('mousedown', function (e) {
             curCol = e.target.parentElement;
             nxtCol = curCol.nextElementSibling;
             pageX = e.pageX; 
           
             var padding = paddingDiff(curCol);
           
             curColWidth = curCol.offsetWidth - padding;
             if (nxtCol)
              nxtColWidth = nxtCol.offsetWidth - padding;
            });
          
            div.addEventListener('mouseover', function (e) {
             e.target.style.borderRight = '2px solid #0000ff';
            })
          
            div.addEventListener('mouseout', function (e) {
             e.target.style.borderRight = '';
            })
          
            document.addEventListener('mousemove', function (e) {
             if (curCol) {
              var diffX = e.pageX - pageX;
           
              if (nxtCol)
               nxtCol.style.width = (nxtColWidth - (diffX))+'px';
          
              curCol.style.width = (curColWidth + diffX)+'px';
             }
            });
          
            document.addEventListener('mouseup', function (e) { 
             curCol = undefined;
             nxtCol = undefined;
             pageX = undefined;
             nxtColWidth = undefined;
             curColWidth = undefined
            });
           }
           
           function createDiv(height){
            var div = document.createElement('div');
            // div.style.top = 0;
            // div.style.right = 0;
            // div.style.width = '5px';
            // div.style.position = 'absolute';
            // div.style.cursor = 'col-resize';
            // div.style.userSelect = 'none';
            // div.style.height = height + 'px';
            // div.style.border = '1px solid black';
            div.className = 'column-resizpx';
            return div;
           }
           
           function paddingDiff(col){
           
            if (getStyleVal(col,'box-sizing') == 'border-box'){
             return 0;
            }
           
            var padLeft = getStyleVal(col,'padding-left');
            var padRight = getStyleVal(col,'padding-right');
            return (parseInt(padLeft) + parseInt(padRight));
          
           }
          
           function getStyleVal(elm,css){
            return (window.getComputedStyle(elm, null).getPropertyValue(css))
           }
          };


        //   const resizeContainer = document.createElement('div');
        //   table.style.position = 'relative';
        //   resizeContainer.style.position = 'relative';
        //   resizeContainer.style.width = table.offsetWidth + 'px';
        //   resizeContainer.className = "vue-columns-resizable";
        //   table.parentElement.insertBefore(resizeContainer, table);
    
        //   let moving = false;
        //   let movingIndex = 0;
    
        //   ths.forEach((th, index) => {
        //     th.style.width = th.offsetWidth + 'px';
    
        //     if (index + 1 >= ths.length) return;
    
        //     const nextTh = ths[index + 1];
        //     const bar = document.createElement('div');
    
        //     bar.style.position = 'absolute';
        //     bar.style.left = nextTh.offsetLeft - 4 + 'px';
        //     bar.style.top = 0;
        //     bar.style.height = barHeight + 'px';
        //     bar.style.width = '8px';
        //     bar.style.cursor = 'col-resize';
        //     bar.style.zIndex = 1;
        //     bar.className = 'columns-resize-bar';
    
        //     bar.addEventListener('mousedown', () => {
        //       moving = true;
        //       movingIndex = index;
        //       document.body.style.cursor = 'col-resize';
        //       document.body.style.userSelect = 'none';
        //     });
    
        //     resizeContainer.appendChild(bar);
        //   });
    
        //   const bars = resizeContainer.querySelectorAll('.columns-resize-bar');
    
        //   document.addEventListener('mouseup', () => {
        //     if (!moving) return;
    
        //     moving = false;
        //     document.body.style.cursor = '';
        //     document.body.style.userSelect = '';
    
        //     bars.forEach((bar, index) => {
        //       const th = ths[index];
        //       const nextTh = ths[index + 1];
        //       th.style.width = th.offsetWidth + 'px';
        //       bar.style.left = nextTh.offsetLeft - 4 + 'px';
        //     });
        //   });
    
        //   const cutPx = str => +str.replace('px', '');
    
        //   const handleResize = e => {
        //     if (moving) {
        //       const th = ths[movingIndex];
        //       const nextTh = ths[movingIndex + 1];
        //       const bar = bars[movingIndex];
        //       th.style.width = cutPx(th.style.width) + e.movementX + 'px';
        //       nextTh.style.width = cutPx(nextTh.style.width) - e.movementX + 'px';
        //       bar.style.left = nextTh.offsetLeft - 4 + e.movementX + 'px';
        //     }
        //   };
    
        //   resizeContainer.addEventListener('mousemove', handleResize);
        //   table.addEventListener('mousemove', handleResize);
        },
      });
}