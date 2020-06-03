Vue.config.devtools = true;
let form = new Vue({
    el: "#append",
    data: {
        listVetstation: [],
        listRegion: [],
        listFarm: [],
        listAnimal: [],
        listMethod: [],
        form: {
            id_vetstation: null,
            id_region: null,
            id_farm: null,
            id_animal: null,
            id_method: null,
            amount: null,
            date: null,
            place: null,
        },
        farm: null
    },
    methods: {
        gridData(){
            let interval = setInterval(function()
            { 
                if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
                    $('.dropdown').dropdown({fullTextSearch: true});
                else clearInterval(interval);
            }, 1000);
        },
        getToday() {
            let today = new Date();
            this.form.date = today.toISOString().split('T')[0];
        },
        getVetstation(){
            axios.get("/assignment/get-vetstation").then( response => (this.listVetstation = response.data));
        },
        getRegion(){
            axios.get("/assignment/get-region").then( response => (this.listRegion = response.data));
        },
        getFarm(){
            axios.get("/assignment/get-farm").then( response => (this.listFarm = response.data));
        },
        getAnimal(){
            axios.get("/assignment/get-animal").then( response => (this.listAnimal = response.data));
        },
        getMethod(){
            axios.get("/assignment/get-method").then( response => (this.listMethod = response.data));
        },
        submit(){
            axios.post("/assignment/create-record", JSON.stringify(this.form),
                {headers: {'Content-Type': 'application/json'}}
                ).then(function(response) {
                    // if (response.status === 200) document.location.href = '/assignment/';
                });
        },
        showModal(modalName){
            $('#modal' + modalName).modal('show');
        },
        submitFarm(){
            let obj = {id_region: this.form.id_region, farm: this.farm};
            axios.post("/assignment/create-farm", JSON.stringify(obj),
                {headers: {'Content-Type': 'application/json'}}
                ).then(function(response) {
                    // if (response.status === 200) document.location.href = '/assignment/';
                });
        }
    },
    computed: {
        filteredRegion(){
            let rows = this.listRegion;
            let id_vet = this.form.id_vetstation;
            if(rows = rows.filter(r => { return r.ID_VetStation === id_vet }))
                return rows;
            else return null;
        },
        filteredFarm(){
            let rows = this.listFarm;
            let id_reg = this.form.id_region;
            if(rows = rows.filter(r => { return r.ID_Region === id_reg }))
                return rows;
            else return null;
        },
        filteredMethod(){
            let rows = this.listMethod;
            let id_vet = this.form.id_vetstation;
            let id_animal = this.form.id_animal;
            if(rows = rows.filter(r => { return r.vt_id === id_vet && r.animal_id === id_animal }))
                return rows;
            else return null;
        }
    },
    mounted:function(){
        this.getVetstation();
        this.getRegion();
        this.getFarm();
        this.getAnimal();
        this.getMethod();
        this.getToday();
        this.gridData();
    }
})


// var addForm = new Vue({
//     el: "#addForm",
//     data: {
//         obj:{
//             vetstation: '0',
//             region: '0',
//             animal: '0',
//             farm: '0',
//             method: '0',
//             amount: '0',
//             dateAdd: this.today,
//             date_enter: this.today,
//             empl: '0'
//         },
//         farm: {
//             id_reg: '',
//             farm: ''
//         },
//         region: '',
//         listRegion: [],
//         listFarm: [],
//         listMethod: [],
//     },
//     methods: {
//         submit () {
//             var json = JSON.stringify(this.obj);
//             axios.post("/assignment/create-record", json, {headers: {'Content-Type': 'application/json'}}).then(function (response)
//                 { 
//                     if (response.data) 
//                         { 
//                             this.obj = [];
//                         }
//                 }
//             );
//         },
//         SaveFarm(){
//             var json = JSON.stringify(this.farm);
//             axios.post("/assignment/create-farm", json, {headers: {'Content-Type': 'application/json'}})
//             .then(function (response)
//                 {
//                     if (response.data == '200') 
//                         {
//                             addForm.getNumFarm($('#region').val());
//                             this.farm = [];
//                         }
//                 }
//             );
//         },
//         getRegion (event) {
//             $('#region').dropdown('clear');
//             axios.get("/assignment/get-region?vet=" + event.target.value).then( response => (this.listRegion = response.data));
//         },
//         getFarm (event) {
//             if (event.target.value != '')
//             {
//                 axios.get("/assignment/get-farm?region=" + event.target.value).then( response => (this.listFarm = response.data));
//             }
//         },
//         getNumFarm (event) {
//             axios.get("/assignment/get-farm?region=" + event).then( response => (this.listFarm = response.data));
//         },
//         getMethod (event) {
//             //Получение списка исследований по выбранной ветстанции mpforvet  + "&idb=" + getForTable.getID()
//             $('#method').dropdown('clear');
//             axios.get("/assignment/get-method?vet=" + this.obj.vetstation + "&animal=" + event.target.value).then( response => (this.listMethod = response.data));
//         },
//         getToday () {
//             let today = new Date();
//             this.obj.dateAdd = today.toISOString().split('T')[0];
//             this.obj.date_enter = today.toISOString().split('T')[0];
//         },
//         setDropDown() {
//             $('#vet').dropdown();
//             $('#region').dropdown();
//             $('#farm').dropdown({fullTextSearch: true});
//             $('#animal').dropdown();
//             $('#method').dropdown({fullTextSearch: true});
//             $('#empl').dropdown();
//             $('#modal').modal();
//         },
//         createFarm(){
//             $('#modal').modal('show');
//             this.region = $('#region option:selected').text();
//             this.farm.id_reg = $('#region').val();
//         },
//         toHome(){
//             document.location.href = '/assignment';
//         }
//     },
//     computed: {
//         today(){
//             return this.getToday();
//         },
//     },
//     mounted: function(){
//         this.setDropDown();
//     }
// });