<template>
  <body>
    <div class="pages" size="A4">
      <header>
        <div class="BYYR">
          <div class="uvdc">
            <p>
              Бюджетное Учреждение Удмуртской Республики "Удмуртский
              ветеринарно-диагностический центр"
            </p>
          </div>
          <div>
            <div class="DF">
              <p>ДФ.03.23.2019</p>
            </div>
            <div class="QMS">
              <p>СИСТЕМА МЕНЕДЖМЕНТА КАЧЕСТВА</p>
              <p>Документированная форма</p>
              <p><b>Направление на испытания</b></p>
            </div>
            <div class="page">
              <p>Страница 1 из 2</p>
            </div>
          </div>
        </div>
      </header>
      <div class="naprav">
        <div>
          <p>НАПРАВЛЕНИЕ на испытание от ___________________</p>
        </div>
        <div>
          <div class="sampleSent">
            <p>Пробы направил: __________________________________________</p>
            <p class="podpis">подпись фамилия дата</p>
          </div>
          <div class="sampleRece">
            <p>Пробы принял: ____________________________________________</p>
            <p class="podpis">подпись фамилия дата</p>
          </div>
        </div>
        <div class="punkt23">
          <p>
            2. Направлено в отдел: __________________________________________
          </p>
          <p>3. Информация по исследованиям:</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 2.5cm">Регистрационный № образца</th>
              <th style="width: 3.5cm">Наименование образца</th>
              <th style="width: 1.8cm">
                Масса (количество) образца (кг, дм3, шт.)
              </th>
              <th style="width: 4cm">Показатели</th>
              <th style="width: 3cm">
                НД на метод испытания (№ пункта области аккредитации ИЦ)
              </th>
              <th style="width: 3cm">
                Дата получения образца, фамилия и подпись исполнителя
              </th>
              <th style="width: 2.5cm">Результат испытаний, ед. измерения</th>
              <th style="width: 2.5cm">Дата окончания исследования</th>
              <th style="width: 3cm">
                Фамилия и подпись отвественного за результат
              </th>
              <th>Дополнительная информация</th>
            </tr>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
              <th>""</th>
            </tr>
          </tbody>
        </table>
        <div class="punkt23">
          <p>Примечение ___________________________________________</p>
          <p>
            Данные в протокол (по требованию заказчика): - средства измерения,
            эталоны, ГСО
          </p>
          <p>Выбор методик:</p>
          <input type="checkbox" /> За ИЦ <input type="checkbox" /> За
          заказчиком ___________________________________________________
          (наименование методик, предложенных заказчиком)
          <p>
            Руководитель подразделения, проводишвшего исследования ____________
            _______________ _____________
          </p>
          <p class="podpis , naprav">подпись фамилия дата</p>
          <p>
            Результаты получил ветеринарный врач ОПиРП _______________
            _________________ ________________
          </p>
          <p class="podpis , naprav">подпись фамилия дата</p>
        </div>
      </div>
      <footer>
        <table>
          <thead>
            <tr>
              <th style="width: 9.5cm">Регистрационный № пробы (образца)</th>
              <th style="width: 9.5cm">Показатели</th>
              <th style="width: 9.5cm">
                Оборудование (№ пункта в списке оборудования ИЦ БУ УР "УВДЦ")
              </th>
            </tr>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>""</th>
              <th>""</th>
              <th>""</th>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  </body>
</template>

<script>
// import guide from './../guide/index.vue';

// export default {
//   components: {
//     guide: guide
//   },
//   data () {
//     return {
//       drawer: false,
//       dialogGuide: false
//     }
//   },
//   methods: {
//     logout(){
//       this.$store.dispatch('logout').then(() => {
//       this.$router.push('/login')});
//     },
//     dialogClose(data){
//       this.dialogGuide = data;
//     }
//   },
//   computed: {
//     user(){
//       return this.$store.getters.name;
//     },
//     idDep(){
//       return this.$store.getters.idDepartment;
// 		}
//   }
// }
</script>

<style scoped>
page {
  size: A4 landscape;
  background-image: none;
  margin: auto;
  width: 29.7cm;
}

.pages {
  size: A4 landscape;
  display: block;
  margin: 0 auto;
  width: 29.7cm;
  height: 21cm;
}

.BYYR {
  width: 29cm;
  height: 2cm;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 3mm;
}

.uvdc {
  margin: 0;
  padding: 0;
  width: 29cm;
  height: 5mm;
  border: 0.5mm solid black;
}

.DF {
  width: 2.5cm;
  height: 1.5cm;
  border: 0.5mm solid black;
  border-top-width: 0mm;
  border-right-width: 0mm;
  padding-top: 5mm;
  float: left;
}

.QMS {
  width: 22cm;
  height: 1.5cm;
  border: 0.5mm solid black;
  border-top-width: 0mm;
  float: left;
}

.QMS p {
  margin: 0;
  padding: 0;
}

.page {
  width: 4.5cm;
  height: 1.5cm;
  border: 0.5mm solid black;
  border-top-width: 0mm;
  border-left-width: 0mm;
  padding-top: 5mm;
  float: left;
}

.naprav {
  text-align: center;
}

.naprav p {
  margin: 0;
  padding: 0;
}

.sampleSent {
  float: left;
}

.sampleRece {
  float: right;
}

.punkt23 {
  clear: both;
  text-align: left;
}

table,
th {
  border-collapse: collapse;
  border: 0.5mm solid black;
  text-align: center;
  font-size: 3mm;
}

.podpis {
  font-size: 2mm;
}
</style>