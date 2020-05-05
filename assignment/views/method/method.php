<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/method.js');
?>
<div class="column" id="method">
	<div class="ui menu table-head">
        <div class="right menu">
            <a class="item" v-on:click="showModal('Create')">Добавить</a>
        </div>
    </div>
	<table class="ui selectable table">
		<thead>
			<th>Исследование</th>
			<th>Действие</th>
		</thead>
		<tbody>
			<tr v-for="data in listMethods">
				<td>{{ data.Title}}</td>
				<td>
		            <div class="ui icon mini buttons">
		                <a class="ui blue button" v-on:click="showModal('Edit', data.ID, data.Title)"><i class="icon edit"></i></a>
		                <a class="ui red button" v-on:click="methodDelete(data.ID)"><i class="icon trash"></i></a>
		            </div>
				</td>
			</tr>
		</tbody>
	</table>
    <div id="modalCreate" class="ui tiny modal">
        <div class="center aligned header">
            Исследование
        </div>
        <div class="content">
            <div class="ui form description">
		<input v-model="methodTitle" type="text"></input>
            </div>
        </div>
        <div class="actions">
            <button class="ui deny orange button">Отмена</button>
            <button class="ui approve green button" v-on:click="createMethod()">Добавить</button>
        </div>
    </div>
    <div id="modalEdit" class="ui tiny modal">
        <div class="center aligned header">
            Редактирование
        </div>
        <div class="content">
            <div class="ui form description">
		<input v-model="methodTitle" type="text"></input>
            </div>
        </div>
        <div class="actions">
            <button class="ui deny orange button">Отмена</button>
            <button class="ui approve green button" v-on:click="methodEdit(methodId, methodTitle)">Изменить</button>
        </div>
    </div>
</div>