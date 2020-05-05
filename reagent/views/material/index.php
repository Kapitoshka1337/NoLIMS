<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/material.js');
?>
<div class="ui centered grid container" id="demo">
<!-- <div class="row" id="demo"> -->
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
						<select multiple class="ui fluid search dropdown" v-model="filters.type" id="type">
							<option v-for="type in listType" v-bind:value="type.title">{{ type.title }}</option>
						</select>
					</div>
					<div class="field">
						<label>Единица измерения</label>
						<select multiple class="ui fluid search dropdown" v-model="filters.measure" id="measure">
							<option v-for="type in listMeasure" v-bind:value="type.title">{{ type.title }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="content">
				<div class="ui bottom attached buttons">
					<button class="ui yellow button" type="button" v-on:click="showModal('Create')">Добавить материал</button>
				</div>
			</div>
		</div>
	</div> -->
	<div class="sixteen wide column">
		<table class="ui compact selectable table">
			<thead>
				<tr>
					<th v-bind:colspan="gridColumns.length">
						Материалы
						<div class="ui right floated mini icon buttons">
							<button class="ui yellow button" v-on:click="showModal('Create')"><i class="icon plus"></i></button>
							<button class="ui teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
						</div>
					</th>
				</tr>
				<tr>
					<th v-for="key in gridColumns" @click="sortBy(Object.keys(key)[0])"
					:class="{
						'one wide': Object.keys(key)[0] === 'material_id',
						'two wide': Object.keys(key)[0] === 'type',
						}"
					>
						{{ Object.values(key)[0] }}
						<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="material in filteredRows">
					<td>{{ material.material_id }}</td>
					<td>{{ material.type }}</td>
					<td>{{ material.material }}</td>
					<td class="two wide">{{ material.measure }}</td>
					<td class="one wide">
						<div class="ui icon mini buttons">
							<button class="ui blue button" v-on:click="showModal('Edit', material.material_id, material.type_id, material.material, material.measure_id)"><i class="icon edit"></i></button>
							<button class="ui red button" v-on:click="materialDelete(material.material_id)"><i class="icon trash"></i></button>
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
		<div id="modalCreate" class="ui tiny card modal">
			<div class="content">
				<div class="content header">
				Материал
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Отдел</label>
							<input type="text" v-model="materials.materialDepartment">
						<label>Тип</label>
							<select v-model="materials.materialType" class="ui fluid search dropdown">
								<option v-for="type in listType" v-bind:value="type.id">{{ type.title }}</option>
							</select>
						<label>Наименование</label>
							<textarea v-model="materials.materialName"></textarea>
						<label>Единица измерения</label>
						<select v-model="materials.materialMeasure" class="ui fluid search dropdown">
							<option v-for="measure in listMeasure" v-bind:value="measure.id">{{ measure.title }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="createMaterial()">Добавить</button>
				<button class="ui deny orange button">Отмена</button>
			</div>
		</div>
		<div id="modalEdit" class="ui tiny card modal">
			<div class="content">
				<div class="header">
					Редактирование
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Тип</label>
							<select v-model="materials.materialType">
								<option v-for="type in listType" v-bind:value="type.id">{{ type.title }}</option>
							</select>
						<label>Наименование</label>
							<input type="text" v-model="materials.materialName">
						<label>Единица измерения</label>
						<select v-model="materials.materialMeasure">
							<option v-for="measure in listMeasure" v-bind:value="measure.id">{{ measure.title }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="materialEdit(materials.materialId, materials.materialType, materials.materialName, materials.materialMeasure)">Изменить</button>
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
				<div class="field" v-for="key in gridColumns" v-show="filters.hasOwnProperty(Object.keys(key))">
					<label>{{ Object.values(key)[0] }}</label>
					<select multiple class="ui search dropdown" v-model="filters[Object.keys(key)]">
						<option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
					</select>

				</div>
			</div>
		</div>
	</div>
	</div>
<!-- </div> -->
</div>