<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_index.js');
?>
<div class="row" id="index">
	<div class="sixteen column">
	<div class="ui two column grid">
		<equipment-dashboard v-for="card in cards" :rows="card" :count-post="countPost"></equipment-dashboard>
	</div>
	</div>
</div>
<template id="equipment-dashboard">
<div class="column">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="rows.gridColumns.tableColumn.length + 1">
					{{ rows.title }}
					<a class="ui blue right floated mini icon button" v-on:click="printTable(rows.content[0].id_type)"><i class="icon print"></i></a>
<!-- 					<a class="ui red right floated mini icon button">{{rows.content.length}}</a>
					<a class="ui orange right floated mini icon button">Всего</a> -->
				</th>
			</tr>
			<tr>
				<th v-for="key in rows.gridColumns.tableColumn">{{ Object.values(key)[0] }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="eq in filteredRows">
				<td class="collapsing">{{ eq.card_number }}</td>
				<td>{{ eq.equipment }}</td>
				<td v-bind:class="{
					'collapsing center aligned success': colorShelfLife(eq.date_next_check) > 3,
					'collapsing center aligned caution': colorShelfLife(eq.date_next_check) <= 10 && colorShelfLife(eq.date_next_check) >= 16,
					'collapsing center aligned danger': colorShelfLife(eq.date_next_check) <= 6
				}">{{ today(eq.date_next_check) }}</td>
				<td class="collapsing right aligned">{{colorShelfLife(eq.date_next_check)}}</td>
				<td class="collapsing"><a><span class="ui violet small circular label" v-show="eq.is_check">Ц</span></a></td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th v-bind:colspan="rows.gridColumns.tableColumn.length + 1">
					<div class="ui left floated label">Страница {{ currentPage }} из {{ listPages.length }}</div>
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
</div>
</template>