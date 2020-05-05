<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/writeoff.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<writeoff-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:count-post="countPost">
		</writeoff-grid>
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
				<div class="field">
					<label>Дата начало</label>
					<input type="date" v-model='start'>
					<label>Дата конец</label>
					<input type="date" v-model='end'>
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button"
			v-on:click="getWriteoff()">Применить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
</div>
<template id="writeoff-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length">
					Потребление материала за период
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
			<tr v-for="material in filteredRows">
				<td class="collapsing">{{ material.material_id }}</td>
				<td class="collapsing">{{ material.date_create }}</td>
				<td>{{ material.material }}</td>
				<td class="collapsing">{{ material.packing_name }}</td>
				<td class="collapsing">{{ material.measure }}</td>
				<td class="collapsing">{{ material.amount_outgo_total }} / {{ material.amount_arrival }}</td>
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