//Получение записей из БД и вывод в таблицу
var getForTable = new Vue ({
    el: "#table",
    data: {
        posts: [],
        currentPage: 1,
        countPost: 32,
        listPages: [],
        baseURL: "/php/get.php?table",
        id_block: 0
    },
    methods: {
        getPosts () {
            axios.get(this.baseURL).then ( response => (this.posts = response.data));
        },
        setPages () {
            let numOfPage = Math.ceil(this.posts.length / this.countPost);
            for (let i = 1; i <= numOfPage; i++)
            {
                this.listPages.push(i);
            }
        },
        paginate (posts) {
            let page = this.currentPage;
            let curPost = this.countPost;
            let from = (page * curPost) - curPost;
            let to = ((page * curPost));
            return posts.slice(from, to);
        },
        getID() {
            return this.id_block;
        }
    },
    created () {
        this.getPosts();
    },
    watch: {
        posts () {
            this.listPages = [];
            this.setPages();
        }
    },
    computed: {
        displayedPosts () {
            return this.paginate(this.posts);
        }
    },
    mounted() {
        axios.get("/php/get.php?block").then(response => (this.id_block = response.data));
    }
});

//Получение записей из БД и вывод в таблицу уведомлений
var Notification = new Vue({
    el: "#Notification",
    data: {
        info: [],
        baseURL: "/php/get.php?notification"
    },
    methods: {
        getSum () {
            axios.get(this.baseURL).then(response => (this.info = response.data));
        }
    },
    created () {
        this.getSum();
    }
});

var NotificationOld = new Vue({
    el: "#NotificationOld",
    data: {
        info: []
    },
    methods: {
        getSum () {
            axios.get("/php/get.php?notification").then(response => (this.info = response.data));
        }
    },
    mounted() {
        axios.get("/php/get.php?notification").then(response => (this.info = response.data));
    }
});

//Вывод в таблицу
// var getForTable = new Vue({
//     el: '#table',
//     data: {
//         info: []
//     },
//     methods: {
//         updateTable () {
//             axios.get("/php/get.php?table").then(response => (this.info = response.data));
//         }
//     },
//     mounted() {
//         axios.get("/php/get.php?table").then(response => (this.info = response.data));
//     }
// });

// var Pagination = new Vue ({
//     el: "#Pagination",
//     data: {
//         post: [],
//         currentPage: 1,
//         countPost: 32,
//         pages: [],
//         baseURL: "/php/get.php?table"
//     },
//     methods: {
//         getPosts () {
//             axios.get(this.baseURL).then ( function(response) { this.post = response.data; } )
//         },
//         setPages () {
//             let numOfPage = Math.ceil(this.post.length / this.countPost);
//             for (let i = 1; i <= numOfPage; i++)
//             {
//                 this.pages.push(i);
//             };
//         },
//         paginate (post) {
//             let page = this.currentPage;
//             let countPost = this.countPost;
//             let from = (page * countPost) - countPost;
//             let to = ((page * countPost));
//             return post.slice(from, to);
//         }
//     },
//     created () {
//         this.getPosts();
//     },
//     watch: {
//         post () {
//             this.setPages();
//         }
//     },
//     computed:{
//         displayedPost () {
//             return this.paginate(this.post);
//         }
//     },
// });

//Заполнение select в модальном окне
// var getForSelectVet = new Vue({
//     el: "#vet",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?select").then(response => (this.info = response.data));
//     }
// });

// var getForSelectEmpl = new Vue({
//     el: "#empl",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?empl").then(response => (this.info = response.data));
//     }
// });

// var getForSelectMethod = new Vue({
//     el: "#method",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?method").then(response => (this.info = response.data));
//     }
// });

// var getForSelectAnimal = new Vue({
//     el: "#animal",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?animal").then(response => (this.info = response.data));
//     }
// });

// var getForSelectRegion = new Vue({
//     el: "#region",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?region").then(response => (this.info = response.data));
//     }
// });

// var getForSelectFarm = new Vue({
//     el: "#farm",
//     data: {
//         info: []
//     },
//     mounted() {
//         axios.get("/php/get.php?farm").then(response => (this.info = response.data));
//     }
// });
// var json;
// $.ajax({
//     type: "GET",
//     url: "/php/get.php",
//     dataType: "json",
//     data: json,
//     success: function (msg) {
//         var res = JSON.parse(JSON.stringify(msg));
//         console.log("Получено\n" + res[4]["Животное"]);
//     },
//     error: function(msg) {
//         console.log("Ошибка\n" + msg);
//     }
// })
// var app = new Vue({
//     el: '#table',
//     data: {
//         paths: [
//             {
//                 id: '1',
//                 vet: 'Алнашская СББЖ',
//                 region: 'Юкаменский',
//                 animal: 'Крупный рогатый скот',
//                 farm: 'Нива',
//                 method: 'Исследования на туберкулез',
//                 amount: '303',
//                 date: '05.12.2019',
//                 empl: 'Фамилия И.О',
//             }            
//         ]
//     }
// });