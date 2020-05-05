<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/farm.js');
?>
<div class="column" id="farm">
    <table class="ui table">
        <tbody class="ui accordion" id="accord">
            <tr v-for="data in listFarms">
                <td>
                    <div class="ui title">{{ data.region }}</div>
                    <div class="ui content">
                        <table class="ui selectable table">
                            <thead>
                                <th>Предприятие</th>
                                <th>Действие</th>
                            </thead>
                            <tbody>
                                <tr v-for="farm in data.farm">
                                    <td>{{ farm.title }}</td>
                                    <td>
                                        <div class="ui icon mini buttons">
                                            <a class="ui blue button" v-on:click="showModal('Edit', farm.id, farm.title)"><i class="icon edit"></i></a>
                                            <a class="ui red button" v-on:click="farmDelete(farm.id)"><i class="icon trash"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="modalEdit" class="ui tiny modal">
        <div class="center aligned header">
            Редактирование
        </div>
        <div class="content">
            <div class="ui form description">
		<input v-model="farmTitle" type="text"></input>
            </div>
        </div>
        <div class="actions">
            <button class="ui deny orange button">Отмена</button>
            <button class="ui approve green button" v-on:click="farmEdit(farmId, farmTitle)">Изменить</button>
        </div>
    </div>
</div>