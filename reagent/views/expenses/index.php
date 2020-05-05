<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/expenses.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<expenses-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:count-post="countPost"
			:error="error">
		</expenses-grid>
	</div>
	<div id="modalFilter" class="ui tiny card modal">
		<div class="content">
			<div class="content header">
				Поиск
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field" v-for="key in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))">
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
					<input type="number" min="0" v-model="error.amount">
				</div>
				<div class="field">
					<label>Причина исправления</label>
					<textarea cols="30" rows="10" v-model="error.description"></textarea>
				</div>
				<div class="field">
					<label>Дата добавления</label>
					<input type="date" v-model="error.date_record" readonly>
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-bind:disabled="validationExpense" v-on:click="submitError()">Отправить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
</div>
<template id="expenses-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length">
					История потребления
					<div class="ui right floated mini icon buttons">
						<button class="ui green button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
						<button class="ui teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
					</div>
				</th>
			</tr>
			<tr>
				<th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
					{{ Object.values(key)[0] }}
					<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="material in paginateRows">
				<td class="collapsing">{{ material.material_id }}</td>
				<td class="collapsing">{{ material.date_create }}</td>
				<!-- <td class="two wide">{{ material.type }}</td> -->
				<td>{{ material.material }}</td>
				<td class="collapsing">{{ material.measure }}</td>
				<td class="collapsing">{{ material.amount_outgo }}</td>
				<td class="collapsing">{{ material.user }}</td>
				<td class="one wide">{{ material.date_usage }}</td>
				<td class="one wide">{{ material.date_record }}</td>
				<td class="collapsing">{{ material.moving_type }}</td>
				<td class="collapsing">
					<div class="ui icon mini buttons" v-if="material.moving_type === 'Потребление'">
						<button class="ui red button" v-on:click="showModal('Error', material.id, material.date_usage, material.amount_outgo, material.material_id, material.material)"><i class="icon exclamation"></i></button>
					</div>
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th v-bind:colspan="columns.length">
					<div class="ui left floated label">
						Страница {{ currentPage }} из {{ listPages.length }}
					</div>
					<div class="ui icon basic right floated small buttons">
						<button class="ui button" v-on:click="currentPage = listPages[0]"><i class="icon angle double left"></i></button>
						<button class="ui button" v-on:click="currentPage--" v-if="currentPage != 1"><i class="icon angle left"></i></button>
						<div class="ui form">
							<div class="field">
								<input type="text" v-model="currentPage" v-bind:value="currentPage">
							</div>
						</div>
						<button class="ui button" v-on:click="currentPage++" v-if="currentPage < listPages.length"><i class="icon angle right"></i></button>
						<button class="ui button" v-on:click="currentPage = listPages.length"><i class="icon angle double right"></i></button>
					</div>
				</th>
			</tr>
		</tfoot>
	</table>
</template>