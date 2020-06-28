<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_index.js');
?>
<div class="row" id="index">
	<div class="sixteen column">
		<equipment-dashboard :rows="cards"></equipment-dashboard>
	</div>
</div>
<template id="equipment-dashboard">
	<div class="ui two column grid">
		<div class="column" v-for="row in rows">
			<table class="ui compact table">
				<thead>
					<tr>
						<th colspan="3">
							{{ row.title }}
							<a class="ui blue right floated mini icon button" v-on:click="printTable(row.content[0].id_type)"><i class="icon print"></i></a>
							<a class="ui red right floated mini icon button">{{row.content.length}}</a>
							<a class="ui orange right floated mini icon button">Всего</a>
						</th>
					</tr>
					<tr>
						<th>Номер</th>
						<th>Оборудование</th>
						<th>Проверка</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="eq in row.content">
						<td class="collapsing">{{ eq.card_number }}</td>
						<td>{{ eq.equipment }}</td>
						<td v-bind:class="{
							success: colorShelfLife(eq.date_next_check) > 30,
							caution: colorShelfLife(eq.date_next_check) <= 15 && colorShelfLife(eq.date_next_check) >= 15,
							danger: colorShelfLife(eq.date_next_check) <= 2
						}">{{ today(eq.date_next_check) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>