<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/handoffRequest.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<handoff-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:count-post="countPost"
			@request="setSelectedMaterials">
		</handoff-grid>
	</div>
	<div id="modalRequest" class="ui large card modal">
		<div class="content">
			<div class="content header">
				Запрос на передачу
			</div>
			<div class="meta">{{ today }}</div>
		</div>
		<div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Тип</th>
                        <th>Материал</th>
                        <th>Ед.изм.</th>
                        <th>Остаток</th>
                        <th>Запрашиваемое количество</th>
                        <th>Местоположение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="material in selectedMaterials">
                        <td class="collapsing">{{ material.type }}</td>
                        <td>{{ material.material }}</td>
                        <td class="collapsing">{{ material.measure }}</td>
                        <td class="collapsing">{{ material.total }}</td>
                        <td class="collapsing">
							<div class="ui form">
								<input type="number" min="0" v-model="material.amount">
							</div>
						</td>
						<td class="collapsing">
							<select v-model="material.location" class="ui search dropdown">
								<option v-for="location in listLocations" v-bind:value="location.id">
								{{ location.cabinet_number }} {{ location.place }} {{ location.notation }}
								</option>
							</select>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="sendRequest()">Отправить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
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
						<option v-for="col in listDepartment" v-bind:value="col.id">{{ col.title }}</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</div>
<template id="handoff-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					Запрос на передачу
					<div class="ui icon right floated tiny buttons">
						<button class="ui yellow button" type="button" v-bind:disabled="selectedMaterials.length <= 0 || filters.id_department.length <= 0" v-on:click="showModal('Request')">Сформировать запрос</button>
						<button class="ui icon teal button" type="button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
					</div>
				</th>
			</tr>
			<tr>
				<th class="collapsing">
					<div class="ui checkbox">
						<input type="checkbox" v-model="selectAllMaterials" v-on:click="select()">
						<label></label>
					</div>
				</th>
				<th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
					{{ Object.values(key)[0] }}
					<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="material in paginateRows">
				<td>
					<div class="ui checkbox">
						<input type="checkbox" 
							v-bind:value="{
							type: material.type, 
							id_arrival_material: material.arrival_material_id, 
							material: material.material,
							measure: material.measure,
							total: material.total,
							amount: '',
							location: ''
							<!-- id_department_to: filters.department_id[0],
							<!-- date_request: getToday() -->
							}" v-model="selectedMaterials">
							<label></label>
					</div>
				</td>
				<td class="collapsing">{{ material.type }}</td>
				<td >{{ material.material }}</td>
				<td class="collapsing">{{ material.measure }}</td>
				<td class="collapsing"
				v-bind:class="{
					success: Math.round(material.total) > Math.round((material.amount / 10) * (50 / 10)),
					caution: Math.round(material.total) <= Math.round((material.amount / 10) * (50 / 10)),
					danger: Math.round(material.total) <= Math.round((material.amount / 10) * (36 / 10))
				}"
				>{{ material.total }} / {{ material.amount }}</td>
				<td class="collapsing"
				>{{ material.date_create }}</td>
				<td class="collapsing"
				v-bind:class="{
					success: colorShelfLife(material.shelf_life) > 62,
					caution: colorShelfLife(material.shelf_life) <= 62,
					danger: colorShelfLife(material.shelf_life) <= 31
				}"
				>{{ material.shelf_life }} <strong>({{ colorShelfLife(material.shelf_life) }})</strong></td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th v-bind:colspan="columns.length + 1">
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