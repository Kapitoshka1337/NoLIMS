// var toaster = new Vue ({
//     el: "#test",
//     methods: {
//         test (title, message) {
//             toastr.success(title, message);
//         }
//     }
// });
//Годовой
Vue.config.devtools = true;
var getInfo = new Vue({
    el: "#getInfo",
    data: {
        obj: {
            vetstation: '',
            method: '',
            animal: '',
            amount: '',
        },
        block: {
            id_block: [],
            amount: '',
            id_mpy: ''
        },
        id: '',
        listVet: [],
        listMethod: [],
        listAnimal: [],
        visible: false,
    },
    methods: {
        // getView () {
        //     axios.get("/php/get.php?view").then( response => (this.listview = response.data));
        // },
        // submit(elem) {
        //     var json = JSON.stringify(elem);
        //     console.log("Отправлено\n" + json);
        //     axios.post("/php/mp.php", json).then(function (response) { if (response.data == "OK") {
        //         toaster.test("Запись добавлена", "План");
        //         getInfo.getView();
        //         getInfo2.getView();
        //         getInfo3.getView();
        //         }
        //     });
        // },
        Save() {
            // let selected = [];
            // $('#vets :selected').each(function(){
            //     selected.push({id: $(this).val(), title: $(this).text()});
            // });
            // this.obj.vetstation = selected;
            // this.obj.push({
            //     vetstation: this.obj.vetstation,
            //     method: this.obj.method,
            //     animal: this.obj.animal,
            //     amount: this.obj.amount,
            // });
            // console.log(this.obj);
            // var json = JSON.stringify(this.obj);
            // console.log("Отправлено\n" + json);
            axios.post("/assignment/plan-create", JSON.stringify(this.obj), {headers: {'Content-Type': 'application/json'}}).then(response => {this.id = response.data});
            // this.obj = [];
        },
        Cancel() {
            document.location.href = 'edit';
        },
        blockSave(){
            if (this.id != null)
            {
                this.block.id_mpy = this.id;
                var json = JSON.stringify(this.block);
                // console.log("Отправлено\n" + json);
                axios.post("/assignment/plan-create-block", json, {headers: {'Content-Type': 'application/json'}}).then(function (response)
                    { 
                        if (response.status == 200) 
                            { 
                                document.location.href = '/assignment/edit';
                            }
                    }
                );
            }
        },
        CancelBlock(){
            $('#block').dropdown('clear');
            this.block = [];
        },
        // btnSelectGOOD() {
        //     let listPlan = document.getElementById("listPlans").childNodes[0].childNodes;
        //     listPlan.forEach(element => {
        //         element.childNodes[2].childNodes[0].childNodes.forEach(el => {
        //             this.toJson.push({
        //                 vetstantion: element.childNodes[0].childNodes[0].getAttribute("id"),
        //                 animal: element.childNodes[0].childNodes[2].getAttribute("id"),
        //                 method: el.childNodes[1].id,
        //                 value: el.childNodes[1].value
        //             });
        //         })
        //     });
        //     this.submit(this.toJson);
        //     this.obj = [];
        //     this.toJson = [];
        // },
        // clearSelect() {
        //     this.obj = [],
        //     this.toJson = []
        // },
        setDropDown() {
            $('#vets').dropdown();
            $('#animal').dropdown();
            $('#method').dropdown();
            $('#block').dropdown();
        },
    },
    watch: {
        id(){
            this.visible = !this.visible; 
        }
    },
    mounted: function(){
        axios.get("/assignment/plan/get-vet").then( response => (this.listVet = response.data));
        axios.get("/assignment/plan/get-animal").then( response => (this.listAnimal = response.data));
        axios.get("/assignment/plan/get-method").then( response => (this.listMethod = response.data));
        this.setDropDown();
        // axios.get("/php/get.php?allblock").then( response => (this.listBlock = response.data));
        // this.getView();
    }
});
//Квартальный
// var getInfo2 = new Vue({
//     el: "#getInfo2",
//     data: {
//         toJson:[],
//         listYear: [],
//     },
//     methods: {
//         submit(elem) {
//             var json = JSON.stringify(elem);
//             console.log("Отправлено\n" + json);
//             axios.post("/php/update.php", json).then(function (response) { if (response.data == "OK") {
//                 toaster.test("Запись обновлена", "План");
//                 getInfo3.getView();
//                 }
//             });
//             this.toJson = [];
//             console.log(this.toJson);
//             setTimeout(() => { this.getView(); }, 1000);
//         },
//         getView(){
//             axios.get("/php/get.php?viewb").then( response => (this.listYear = response.data));
//         },
//         btnSelected(event) {
//             let target = event.target.parentElement.parentElement;;
//             this.toJson.push({
//                 id: target.childNodes[0].getAttribute("id"),
//                 vet: target.childNodes[2].getAttribute("id"),
//                 animal: target.childNodes[4].getAttribute("id"),
//                 method: target.childNodes[6].getAttribute("id"),
//                 block: target.childNodes[10].childNodes[0].value,
//                 block_plan: target.childNodes[12].childNodes[0].value
//             })
//             this.submit(this.toJson);
//             target.childNodes[10].childNodes[0].value = '';
//             target.childNodes[12].childNodes[0].value = '';
//         }
//     },
//     mounted(){
//         axios.get("/php/get.php?viewb").then( response => (this.listYear = response.data));
//     }
// });
// //Общий
// var getInfo3 = new Vue({
//     el: "#getInfo3",
//     data: {
//         listTotal: []
//     },
//     methods: {
//         getView() {
//             axios.get("/php/get.php?viewt").then( response => (this.listTotal = response.data));    
//         }
//     },
//     mounted() {
//         axios.get("/php/get.php?viewt").then( response => (this.listTotal = response.data));
//     }
// });