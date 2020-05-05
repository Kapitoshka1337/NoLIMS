<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/expenses.js');
?>
<div class="row" id="demo1">
<!-- 	<div class="three wide column">
		<div class="ui fluid card">
			<div class="content">
				<div class="center aligned header">
					<h2>Фильтр</h2>
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Тип</label>
						<select multiple class="ui search dropdown" v-model="filters.type">
							<option v-for="type in returnType" v-bind:value="type">{{ type }}</option>
						</select>
					</div>
					<div class="field">
						<label>Материал</label>
						<select multiple class="ui search dropdown" v-model="filters.material">
							<option v-for="material in returnMaterial" v-bind:value="material">{{ material }}</option>
						</select>
					</div>
					<div class="field">
						<label>Сотрудник</label>
						<select multiple class="ui search dropdown" v-model="filters.user">
							<option v-for="empl in returnEmpl" v-bind:value="empl">{{ empl }}</option>
						</select>
					</div>
					<div class="field">	
						<label>Дата использования</label>
						<input type="date">
					</div>
				</div>
			</div>
		</div>
	</div> -->
	<div class="sixteen wide column">
		<table class="ui compact selectable table">
			<thead>
				<tr>
					<th v-bind:colspan="gridColumns.length">
						Расход
						<div class="ui right floated mini icon buttons">
							<button class="ui teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
						</div>
					</th>
				</tr>
				<tr>
					<th v-for="key in gridColumns" @click="sortBy(Object.keys(key)[0])">
						{{ Object.values(key)[0] }}
						<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="material in filteredRows">
					<td width="40">{{ material.material_id }}</td>
					<td class="one wide">{{ material.date_create }}</td>
					<td class="two wide">{{ material.type }}</td>
					<td>{{ material.material }}</td>
					<td class="one wide">{{ material.measure }}</td>
					<td class="one wide">{{ material.amount_outgo }}</td>
					<td class="one wide">{{ material.date_usage }}</td>
					<td class="one wide">{{ material.date_record }}</td>
					<td class="two wide">{{ material.user }}</td>
					<td class="two wide">{{ material.moving_type }}</td>
					<td class="one wide">
						<div class="ui icon mini buttons" v-if="material.moving_type === 'Потребление'">
							<button class="ui red button" v-on:click="showModal('Error')"><i class="icon exclamation"></i></button>
						</div>
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th v-bind:colspan="gridColumns.length">
						<div class="ui right floated pagination menu">
							<a class="item" v-on:click="currentPage--" v-if="currentPage != 1"><<</a>
							<a class="item" v-for="numPage in listPages" v-on:click="currentPage = numPage" v-bind:class="{active: currentPage === numPage}">{{ numPage }}</a>
							<a class="item" v-on:click="currentPage++" v-if="currentPage < listPages.length">>></a>
						</div>
					</th>
				</tr>
			</tfoot>
		</table>
	</div>
	<div id="modalFilter" class="ui tiny card modal">
		<div class="content">
			<div class="content header">
				Поиск
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field" v-for="key in gridColumns" v-show="filters.hasOwnProperty(Object.keys(key))">
					<label>{{ Object.values(key)[0] }}</label>
					<select multiple class="ui search dropdown" v-model="filters[Object.keys(key)]">
						<option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div id="modalError" class="ui tiny card modal">
		<div class="content">
			<div class="content header">
				Исправление записи
			</div>
			<div class="meta"></div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Количество</label>
					<input type="number" min="0" >
				</div>
				<div class="field">
					<label>Причина исправления</label>
					<textarea cols="30" rows="10"></textarea>
				</div>
				<div class="field">
					<label>Дата добавления</label>
					<input type="date" v-model="error.date_record" readonly>
				</div>
				<!-- <div class="field"> -->
					<!-- <label>Дата добавления</label> -->
					<!-- <input type="date" readonly hidden> -->
				<!-- </div> -->
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button"
			v-on:click="materialOutgo(materials.materialArrivalId, materials.date_usage, materials.amount)">Отправить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
</div>