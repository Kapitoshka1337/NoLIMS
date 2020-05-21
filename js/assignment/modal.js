var addForm = new Vue({
    el: "#addForm",
    data: {
        obj:{
            vetstation: '0',
            region: '0',
            animal: '0',
            farm: '0',
            method: '0',
            amount: '0',
            dateAdd: this.today,
            date_enter: this.today,
            empl: '0',
            place: ''
        },
        farm: {
            id_reg: '',
            farm: ''
        },
        region: '',
        listRegion: [],
        listFarm: [],
        listMethod: [],
    },
    methods: {
        submit () {
            var json = JSON.stringify(this.obj);
            axios.post("/assignment/create-record", json, {headers: {'Content-Type': 'application/json'}}).then(function (response)
                { 
                    if (response.data) 
                        { 
                            this.obj = [];
                        }
                }
            );
        },
        SaveFarm(){
            var json = JSON.stringify(this.farm);
            axios.post("/assignment/create-farm", json, {headers: {'Content-Type': 'application/json'}})
            .then(function (response)
                {
                    if (response.data == '200') 
                        {
                            addForm.getNumFarm($('#region').val());
                            this.farm = [];
                        }
                }
            );
        },
        getRegion (event) {
            $('#region').dropdown('clear');
            axios.get("/assignment/get-region?vet=" + event.target.value).then( response => (this.listRegion = response.data));
        },
        getFarm (event) {
            if (event.target.value != '')
            {
                axios.get("/assignment/get-farm?region=" + event.target.value).then( response => (this.listFarm = response.data));
            }
        },
        getNumFarm (event) {
            axios.get("/assignment/get-farm?region=" + event).then( response => (this.listFarm = response.data));
        },
        getMethod (event) {
            //Получение списка исследований по выбранной ветстанции mpforvet  + "&idb=" + getForTable.getID()
            $('#method').dropdown('clear');
            axios.get("/assignment/get-method?vet=" + this.obj.vetstation + "&animal=" + event.target.value).then( response => (this.listMethod = response.data));
        },
        getToday () {
            let today = new Date();
            this.obj.dateAdd = today.toISOString().split('T')[0];
            this.obj.date_enter = today.toISOString().split('T')[0];
        },
        setDropDown() {
            $('#vet').dropdown();
            $('#region').dropdown();
            $('#farm').dropdown({fullTextSearch: true});
            $('#animal').dropdown();
            $('#method').dropdown({fullTextSearch: true});
            $('#empl').dropdown();
            $('#modal').modal();
        },
        createFarm(){
            $('#modal').modal('show');
            this.region = $('#region option:selected').text();
            this.farm.id_reg = $('#region').val();
        },
        toHome(){
            document.location.href = '/assignment';
        }
    },
    computed: {
        today(){
            return this.getToday();
        },
    },
    mounted: function(){
        this.setDropDown();
    }
});