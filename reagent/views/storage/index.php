<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/storage.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<storage-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:count-post="countPost"
			:materials="materials">
		</storage-grid>
	</div>
	<div id="modalOutgo" class="ui tiny card modal">
		<div class="content">
			<div class="content header">
				{{ materials.materialName }}
			</div>
			<div class="meta">Расход ({{ materials.materialMeasure }})</div>
		</div>
		<div class="content" v-if="validationExpense">
			<div class="ui bottom warning message">
				<i class="icon warning"></i>
				{{ validationExpense }}
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Потратить в количестве</label>
					<input type="number" min="0" v-model="materials.amount">
				</div>
				<div class="field">
					<label>Дата потребления</label>
					<input type="date" v-model="materials.date_usage">
				</div>
					<input type="date" v-model="materials.date_record" readonly hidden>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button"
			v-on:click="submitExpense()" v-bind:disabled="validationExpense">Потратить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
	<div id="modalAppendPassport" class="ui tiny card modal">
		<div class="content">
			<div class="content header">
				Паспорт
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Выберите файл</label>
					<input type="file" ref="file" v-on:change="handleFileUpload()">
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="submitFile()">Отправить</button>
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
						<option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</div>
<template id="storage-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					Склад
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
				<td class="one wide">{{ material.date_order }}</td>
				<td class="collapsing">{{ material.location }}</td>
				<!-- <td class="two wide">{{ material.type }}</td> -->
				<td>{{ material.material }}</td>
				<td width="100">{{ material.measure }}</td>
				<td class="collapsing"
				v-bind:class="{
					success: Math.round(material.total) > Math.round((material.amount / 10) * (50 / 10)),
					caution: Math.round(material.total) <= Math.round((material.amount / 10) * (50 / 10)),
					danger: Math.round(material.total) <= Math.round((material.amount / 10) * (36 / 10))
				}">{{ material.total }} / {{ material.amount }}</td>
				<td class="collapsing"
				v-bind:class="{
					success: colorShelfLife(material.shelf_life) > 62,
					caution: colorShelfLife(material.shelf_life) <= 62,
					danger: colorShelfLife(material.shelf_life) <= 31
				}"
				>{{ material.shelf_life }} <strong>({{ colorShelfLife(material.shelf_life) }})</strong></td>
				<td class="one wide">
					<div class="ui icon mini buttons">
						<button class="ui blue button" v-if="material.total <= 0 || colorShelfLife(material.shelf_life) <= 1" v-on:click="moveToArchive(material.arrival_material_id)"><i class="icon archive"></i></button>
						<button class="ui green button" v-if="material.passport != null" v-on:click="showPassport(material.arrival_material_id)"><i class="icon eye"></i></button>
						<button class="ui yellow button" v-if="material.passport === null" v-on:click="showModal('AppendPassport', material.arrival_material_id)"><i class="icon plus"></i></button>
						<button class="ui red button" v-on:click="showModal('Outgo', material.arrival_material_id, material.material, material.measure, material.total)"><i class="icon tint"></i></button>
					</div>
				</td>
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