<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/error.js');
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
		<error-list
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters">
		</error-list>
	</div>
</div>
<template id="error-list">
	<div class="ui cards">
		<div class="ui fluid card" v-for="error in filteredRows">
			<div class="content">
				<span v-bind:class="{
				'ui top attached red right label': error.status === 'Не подтвержден',
				'ui top attached yellow right label': error.status === 'Рассмотрение',
				'ui top attached green right label': error.status === 'Подтвержден'
				}">{{ error.status }}</span>
				<div class="header">Исправление от {{ error.user }}
				</div>
				<div class="right floated header">
					<div class="ui icon tiny two buttons" v-if="error.status != 'Подтвержден' && error.status != 'Не подтвержден'">
						<button class="ui green button" v-on:click="errorApprove(error.id, error.id_outgo, error.amount)"><i class="icon check"></i></button>
						<button class="ui red button" v-on:click="errorDeclining(error.id)"><i class="icon ban"></i></button>
					</div>
				</div>
				<div class="meta">
					<div class="category">{{ error.date_record }}</div>
				</div>
				<div class="description">
					<p>Дата потребления: {{ error.date_usage }}</p>
					<p>Материал ({{ error.id_material }}): {{ error.material }}</p>
					<p>Количество: {{ error.amount_expenses }} -> {{ error.amount }}</p>
					<p>Причина: {{ error.description }}</p>
				</div>
			</div>
		</div>
	</div>
</template>