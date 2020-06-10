<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/reagent/arrivals.js');
    use yii\helpers\Url;
?>
<div class="row" id="demo">
	<div class="three wide column">
		<div class="ui fluid card">
			<div class="content">
				<div class="ui bottom attached buttons">
					<a href="<?php echo Url::toRoute(['new-arrival/']) ?>" class="ui yellow button">Новое</a>
				</div>
			</div>
		</div>
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
		<order-list
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters">
		</order-list>
	</div>
</div>
<template id="order-list">
	<div class="ui cards">
		<div class="ui fluid card" v-for="order in filteredRows">
			<div class="content">
				<span v-bind:class="{
				'ui top attached green right label': order.moving_type === 'Поступление',
				'ui top attached blue right label': order.moving_type === 'Перевод'
				}">{{ order.moving_type }}</span>
				<div class="header">Заказ № {{ order.num_order }} от {{ order.date_order }}</div>
				<div class="meta">
					<span class="category">Отдел: {{ order.department }}</span>
				</div>
				<div class="description">
					<div class="ui accordion">
						<div class="title">
							<i class="icon dropdown"></i>
							Поступившие материалы
						</div>
						<div class="content">
							<table class="ui compact selectable table">
								<thead>
									<tr>
										<th class="collapsing">Код</th>
										<th class="collapsing">Тип</th>
										<th >Материал</th>
										<th class="collapsing">Ед.изм.</th>
										<th class="collapsing">Кол</th>
										<th class="collapsing">Дата изг.</th>
										<th class="collapsing">Годен до</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="material in order.materials">
										<td>{{ material.id_material }}</td>
										<td>{{ material.type }}</td>
										<td>{{ material.material }}</td>
										<td>{{ material.measure }}</td>
										<td>{{ material.amount }}</td>
										<td>{{ material.date_create }}</td>
										<td>{{ material.shelf_life }}</td>
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