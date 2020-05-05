<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/handoffHistory.js');
?>
<div class="row" id="demo1">
	<div class="three wide column">
		<div class="ui fluid card">
			<div class="content">
				<div class="center aligned header">
					<h2>Поиск</h2>
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field" v-for="key in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))">
						<label>{{ Object.values(key)[0] }}</label>
						<select multiple class="ui fluid search dropdown" v-model="filters[Object.keys(key)]">
							<option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="thirteen wide column">
		<handoff-list
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters">
		</handoff-list>
	</div>
</div>
<template id="handoff-list">
	<div class="ui cards">
		<div class="ui fluid card" v-for="order in filteredRows">
			<div class="content">
				<span v-bind:class="{
				'ui top attached yellow right label': order.id_handoff_status === '1',
				'ui top attached green right label': order.id_handoff_status === '2',
				'ui top attached red right label': order.id_handoff_status === '3'
				}">{{ order.materials[0].status }}</span>
				<div class="header">{{ order.materials[0].department_from }} ({{ order.materials[0].user }}) -> {{ order.materials[0].department_to }}
				</div>
				<div class="right floated header" v-if="order.id_department_from != <?php echo Yii::$app->user->identity['id_department'] ?>">
					<div class="ui icon tiny two buttons" v-if="order.id_handoff_status != 2 && order.id_handoff_status != 3">
						<button class="ui green button" v-on:click="requestApprove(order.id, order.id_department_from, order.materials)"><i class="icon check"></i></button>
						<button class="ui red button" v-on:click="requestDeclining(order.id)"><i class="icon ban"></i></button>
					</div>
				</div>
				<div class="meta">
					<div class="category">Запрос / Ответ: {{ order.date_request }} / {{ order.date_handoff }}</div>
				</div>
				<div class="description">
					<div class="ui accordion">
						<div class="title">
							<i class="icon dropdown"></i>
							Запрашиваемые материалы
						</div>
						<div class="content">
							<table class="ui compact selectable table">
								<thead>
									<tr>
										<th v-for="key in columns">
											{{ Object.values(key)[0] }}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="material in order.materials">
										<td сlass="collapsing">{{ material.material_id }}</td>
										<td>{{ material.material }}</td>
										<td class="collapsing">{{ material.measure }}</td>
										<td class="collapsing">{{ material.amount }} / {{ material.total }}</td>
										<td class="collapsing">{{ material.date_create }}</td>
										<td class="collapsing">{{ material.shelf_life }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>