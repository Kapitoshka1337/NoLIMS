var block = new Vue({
    el: "#getInfo",
    methods: {
        Cancel(){
            document.location.href = '/edit';
        }
    },
    mounted: function(){
        $('.dropdown').dropdown();
    }
})

// var block = new Vue({
// el: "#createblock",
// data: {
//     listMethods: [],
//     block: '',
//     block_plan: '',
//     id_mpy: ''
// },
// methods: {
//     getEdit(){
//         axios.get("/get-edit").then( response => (this.listMethods = response.data));
//     },
//     blockDelete(id){
//         axios.get("/delete-block?id=" + id).then( response => (this.getMethod()));
//     },
//     yearDelete(id){

//     },
//     showModal(modalName, id = null){
//         this.id_mpy = id;
//         $('#modal' + modalName).modal('show');
//     },
//     createBlock(){
//         axios.get("/plan-create-block?id=" + this.id_mpy + "&block=" + this.block + "&block_plan=" + this.block_plan).then( response => (this.getEdit()));
//     }
// },
// created() {
//         console.log($('.dropdown').dropdown());
//         $('.dropdown').dropdown()
// },
// mounted: function(){
//         this.getEdit();
//         $('.ui.accordion').accordion();
//     }
// })