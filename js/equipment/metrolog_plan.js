Vue.config.devtools = true;
Vue.component('help-eq-grid', {
  template: '#help-eq-grid',
  props: {
    rows: Array,
    columns: Array,
    filters: Array,
    countPost: Number,
    NameObject: String,
    filterDate: Object
  },
  data: function () {
    let sortColumns = {};
    this.columns.forEach(function (key){
      Object.keys(key).some(function(row){
        if (row !== 'action')
          sortColumns[row] = 1;
      });
    });
    return {
      sortKey: '',
      sortColumns: sortColumns,
      currentPage: 1,
      listPages: [],
      selectAllMaterials: false,
      selectedEquipments: [],
      obj: {
        helpEq: 1,
        testEq: 2,
        measuringEq: 3,
      },
    }
  },
  methods: {
    sortBy: function (key) {
      if(key === 'action') return;
      this.sortKey = key;
      this.sortColumns[key] = this.sortColumns[key] * -1;
    },
    setPages () {
      let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
      for (let i = 1; i <= numOfPage; i++)
        this.listPages.push(i);
    },
    paginate (rows) {
      let page = this.currentPage;
      let curPost = this.countPost;
      let from = (page * curPost) - curPost;
      let to = ((page * curPost));
      return rows.slice(from, to);
    },
    showModal(modalName, eq){
      this.$emit('request', this.selectedEquipments);
      $('#modal' + modalName).modal('show');
    },
    clearFilter(){
      $('.dropdown').dropdown('clear');
    },
    select() {
      this.selectedEquipments = [];
      if (!this.selectAllMaterials)
        for (let i in this.paginateRows)
          this.selectedEquipments.push({
            id_equipment: this.paginateRows[i].id,
            number: this.paginateRows[i].number,
            id_department: this.paginateRows[i].id_department,
            type: this.paginateRows[i].type,
            date_next_check: this.paginateRows[i].date_next_check,
            equipment: this.paginateRows[i].equipment
          });
    },
    today(date){
      let today = new Date(date);
      return today.toLocaleString().split(',')[0];
    },
    printTable(){
      let objs = {start: this.today(this.filterDate.start), end: this.today(this.filterDate.end), type: this.obj[this.NameObject]};
      axios.post("/equipment/print-table", JSON.stringify(objs), {headers: {'Content-Type': 'application/json'}}).then( response => (window.open('/assets/template/plan.pdf')));
    }
  },
  watch: {
    filteredRows() {
      this.listPages = [];
      this.setPages();
    }
  },
  computed: {
    filteredRows: function () {
      let sortKey = this.sortKey;
      let order = this.sortColumns[sortKey] || 1;
      let rows = this.rows;
      if (sortKey)
      {
        rows = rows.slice().sort(function (a, b) {
          a = a[sortKey];
          b = b[sortKey];
          if(a === b) return 0 * order;
          else if (a > b) return 1 * order;
          else return - 1 * order;
        })
      }
      return rows.filter(r =>
      {
        return Object.keys(this.filters).every(f =>
        {
          if(r.total === null) r.total = r.amount;
            return this.filters[f].length < 1 || this.filters[f].includes(r[f])
        })
      })
    },
    paginateRows(){
      return this.paginate(this.filteredRows);
    }
  },
});

let verification = new Vue({
  el: '#verification',
  data: {
    helpEq: {
      gridColumns: {
        tableColumn: [
          {'card_number':'Номер'},
          {'equipment':'Оборудование'},
          {'date_next_check':'Дата проверки'},
          {'cabinet_number':'Кабинет'},
        ],
        filterColumn: [
          {'equipment':'Оборудование'}
        ]
      },
      gridData: [],
      filters: {
        equipment: []
      }
    },
    testEq: {
      gridColumns: {
        tableColumn: [
          {'card_number':'Номер'},
          {'equipment':'Оборудование'},
          {'date_next_check':'Дата проверки'},
          {'cabinet_number':'Кабинет'},
        ],
        filterColumn: [
          {'equipment':'Оборудование'}
        ]
      },
      gridData: [],
      filters: {
        equipment: []
      }
    },
    measuringEq: {
      gridColumns: {
        tableColumn: [
          {'card_number':'Номер'},
          {'equipment':'Оборудование'},
          {'date_next_check':'Дата проверки'}
        ],
        filterColumn: [
          {'equipment':'Оборудование'}
        ]
      },
      gridData: [],
      filters: {
        equipment: []
      }
    },
    maintenanceEq: {
      gridColumns: {
        tableColumn: [
          {'equipment':'Оборудование'},
          {'date_next_check':'Дата проверки'}
        ],
        filterColumn: [
          {'equipment':'Оборудование'}
        ]
      },
      gridData: [],
      filters: {
        equipment: []
      }
    },
    countPost: 100,
    NameObject: 'helpEq',
    gridData: [],
    obj: {
      helpEq: 1,
      testEq: 2,
      measuringEq: 3,
    },
    selectedEquipments: [],
    filterDate: {
      start: null,
      end:  null
    }
  },
  methods:{
    setTab(){
      let interval = setInterval(function()
      { 
        if($('.menu .item').tab().length <= 0)
          $('.menu .item').tab();
        else clearInterval(interval);
      }, 1000);

      // let interval1 = setInterval(function()
      // { 
      //   if($('.ui.calendar').calendar({type: 'month',
      //     text: {monthsShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Окьябрь', 'Ноябрь', 'Декабрь'],
      //     months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Окьябрь', 'Ноябрь', 'Декабрь']}}).length <= 0)
      //     $('.ui.calendar').calendar({type: 'month',
      //     text: {monthsShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Окьябрь', 'Ноябрь', 'Декабрь'],
      //   months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Окьябрь', 'Ноябрь', 'Декабрь']}});
      //   else clearInterval(interval1);
      // }, 1000);
    },
    getPlanVerification(type){
      //КОСТЫЛЬ
      this.NameObject = type;
    },
    getVer(){
        // if(this.$data[this.NameObject].gridData.length === 0)
        // {
          let objs = {start: this.today(this.filterDate.start), end: this.today(this.filterDate.end), type: this.obj[this.NameObject]};
          axios.post("/equipment/get-plan-verification", JSON.stringify(objs), {headers: {'Content-Type': 'application/json'}}).then( response => (this.$data[this.NameObject].gridData = response.data));
        // }
    },
    today(date){
      let today = new Date(date);
      return today.toLocaleString().split(',')[0];
    },
    setDropdown(){
      $('.dropdown').dropdown({fullTextSearch: true});
    },
    setSelectedEquipments(info){
      this.selectedEquipments = info;
    },
    deleteMaterial(index, equipment){
      var idx = this.selectedEquipments.indexOf(equipment);
      if (idx > -1) this.selectedEquipments.splice(idx, 1);
    },
    returnUniq(column, eq){
      let result = [];
      for (let str of this.$data[eq].gridData)
        if (!result.includes(str[column]))
          result.push(str[column]);
        result = result.slice().sort(function (a, b){
          if(a === b) return 0 ;
          else if (a > b) return 1;
          else return - 1;
        })
      return result;
    },
    sendRequest(){
      let request = [];
      for(let i in this.selectedEquipments)
      {
        request.push({
          id_department: this.selectedEquipments[i].id_department,
          id_equipment: this.selectedEquipments[i].id_equipment
        });
      }
      axios.post("/equipment/send-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
      .then(response => (console.log(1)));
    },
  },
  mounted: function() {
    this.setTab();
    this.setDropdown();
  }
});

// Vue.component('test-eq-grid', {
//   template: '#test-eq-grid',
//   props: {
//     rows: Array,
//     columns: Array,
//     filters: Array,
//     countPost: Number,
//     // equipment: Array
//   },
//   data: function () {
//     let sortColumns = {};
//     this.columns.forEach(function (key){
//       Object.keys(key).some(function(row){
//         if (row !== 'action')
//           sortColumns[row] = 1;
//       });
//     });
//     return {
//       sortKey: '',
//       sortColumns: sortColumns,
//       currentPage: 1,
//       listPages: [],
//       selectAllMaterials: false,
//       selectedEquipments: []
//     }
//   },
//   methods: {
//     sortBy: function (key) {
//       if(key === 'action') return;
//       this.sortKey = key;
//       this.sortColumns[key] = this.sortColumns[key] * -1;
//     },
//     setPages () {
//       let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
//       for (let i = 1; i <= numOfPage; i++)
//         this.listPages.push(i);
//     },
//     paginate (rows) {
//       let page = this.currentPage;
//       let curPost = this.countPost;
//       let from = (page * curPost) - curPost;
//       let to = ((page * curPost));
//       return rows.slice(from, to);
//     },
//     showModal(modalName, eq){
//       this.$emit('request', eq);
//       // this.equipment = eq;
//       // console.log(eq);
//       $('#modal' + modalName).modal('show');
//     },
//     clearFilter(){
//       $('.dropdown').dropdown('clear');
//     },
//     select() {
//       this.selectedEquipments = [];
//       if (!this.selectAllMaterials)
//         for (let i in this.paginateRows)
//           this.selectedEquipments.push(this.paginateRows[i].id);
//     }
//   },
//   watch: {
//     filteredRows() {
//       this.listPages = [];
//       this.setPages();
//     }
//   },
//   computed: {
//     filteredRows: function () {
//       let sortKey = this.sortKey;
//       let order = this.sortColumns[sortKey] || 1;
//       let rows = this.rows;
//       if (sortKey)
//       {
//         rows = rows.slice().sort(function (a, b) {
//           a = a[sortKey];
//           b = b[sortKey];
//           if(a === b) return 0 * order;
//           else if (a > b) return 1 * order;
//           else return - 1 * order;
//         })
//       }
//       return rows.filter(r =>
//       {
//         return Object.keys(this.filters).every(f =>
//         {
//           if(r.total === null) r.total = r.amount;
//             return this.filters[f].length < 1 || this.filters[f].includes(r[f])
//         })
//       })
//     },
//     paginateRows(){
//       return this.paginate(this.filteredRows);
//     }
//   },
// });

// Vue.component('measuring-eq-grid', {
//   template: '#measuring-eq-grid',
//   props: {
//     rows: Array,
//     columns: Array,
//     filters: Array,
//     countPost: Number,
//     // equipment: Array
//   },
//   data: function () {
//     let sortColumns = {};
//     this.columns.forEach(function (key){
//       Object.keys(key).some(function(row){
//         if (row !== 'action')
//           sortColumns[row] = 1;
//       });
//     });
//     return {
//       sortKey: '',
//       sortColumns: sortColumns,
//       currentPage: 1,
//       listPages: [],
//       selectAllMaterials: false,
//       selectedEquipments: []
//     }
//   },
//   methods: {
//     sortBy: function (key) {
//       if(key === 'action') return;
//       this.sortKey = key;
//       this.sortColumns[key] = this.sortColumns[key] * -1;
//     },
//     setPages () {
//       let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
//       for (let i = 1; i <= numOfPage; i++)
//         this.listPages.push(i);
//     },
//     paginate (rows) {
//       let page = this.currentPage;
//       let curPost = this.countPost;
//       let from = (page * curPost) - curPost;
//       let to = ((page * curPost));
//       return rows.slice(from, to);
//     },
//     showModal(modalName, eq){
//       this.$emit('request', eq);
//       // this.equipment = eq;
//       // console.log(eq);
//       $('#modal' + modalName).modal('show');
//     },
//     clearFilter(){
//       $('.dropdown').dropdown('clear');
//     },
//     select() {
//       this.selectedEquipments = [];
//       if (!this.selectAllMaterials)
//         for (let i in this.paginateRows)
//           this.selectedEquipments.push(this.paginateRows[i].id);
//     }
//   },
//   watch: {
//     filteredRows() {
//       this.listPages = [];
//       this.setPages();
//     }
//   },
//   computed: {
//     filteredRows: function () {
//       let sortKey = this.sortKey;
//       let order = this.sortColumns[sortKey] || 1;
//       let rows = this.rows;
//       if (sortKey)
//       {
//         rows = rows.slice().sort(function (a, b) {
//           a = a[sortKey];
//           b = b[sortKey];
//           if(a === b) return 0 * order;
//           else if (a > b) return 1 * order;
//           else return - 1 * order;
//         })
//       }
//       return rows.filter(r =>
//       {
//         return Object.keys(this.filters).every(f =>
//         {
//           if(r.total === null) r.total = r.amount;
//             return this.filters[f].length < 1 || this.filters[f].includes(r[f])
//         })
//       })
//     },
//     paginateRows(){
//       return this.paginate(this.filteredRows);
//     }
//   },
// });