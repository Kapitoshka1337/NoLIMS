<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_equipment.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<equipment-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:count-post="countPost"
			:check-Eq="check"
			:handoff="handoff">
		</equipment-grid>
	</div>
	<div id="modalPrint" class="ui tiny card modal">
		<div class="content">
			<div class="content header">Регистрационная карта | Этикетка</div>
		</div>
		<div class="content">
		</div>
		<div class="actions">
			<button class="ui approve green button">Сформировать</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
	<div id="modalFilter" class="ui tiny card modal">
		<div class="content">
			<div class="content header">Поиск</div>
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
	<div id="modalHandoff" class="ui tiny card modal">
		<div class="content">
			<div class="header">Перемещение</div>
			<div class="meta">{{ handoff.department }}</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Переместить в отдел</label>
					<select class="ui search dropdown" v-model="handoff.id_department_to">
						<option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
					</select>
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="setHandoff()">Сохранить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
	<div id="modalCheck" class="ui tiny card modal">
		<div class="content">
			<div class="content header">Поверка | Проверка</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Текущая (пройденная)</label>
					<input type="date" v-model="check.date_current_check">
				</div>
				<div class="field">
					<label>Cледующая (предстоящая)</label>
					<input type="date" v-model="check.date_next_check">
				</div>
				<div class="field">
					<label>Вид загружамого файла</label>
					<select class="ui search dropdown" v-model="check.id_upload_document_type">
						<option v-for="doc in listDocType" v-bind:value="doc.id">{{ doc.title }}</option>
					</select>
				</div>
				<div class="field">
					<label>Номер документа</label>
					<input type="text" v-model="check.number_document">
				</div>
				<div class="field">
					<input type="file" ref="upload_file_name" v-on:change="handleFileUpload()">
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="submitFile()">Сохранить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
</div>
<template id="equipment-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					Оборудование
					<div class="ui orange right floated icon top right mini pointing dropdown button">
						<i class="icon tags"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<div class="header">
								<i class="tags icon"></i>
								Поставить метку
							</div>
							<div class="item" v-on:click="setTag('is_archive')">
								<div class="ui teal empty circular label"></div>
								Архив
							</div>
							<div class="item" v-on:click="setTag('is_working')">
								<div class="ui green empty circular label"></div>
								Используется
							</div>
							<div class="item" v-on:click="setTag('is_conservation')">
								<div class="ui yellow empty circular label"></div>
								Консервация
							</div>
							<div class="item" v-on:click="setTag('is_repair')">
								<div class="ui red empty circular label"></div>
								Ремонт
							</div>
							<div class="item" v-on:click="setTag('is_check')">
								<div class="ui violet empty circular label"></div>
								ЦСМ
							</div>
							<div class="divider"></div>
							<div class="header" v-show="selectedEquipments.length > 0">
								<i class="tags icon"></i>
								Снять метку
							</div>
							<div class="item" v-for="item in tagsFromSelected" v-on:click="setTag(Object.keys(item))">
								{{ Object.keys(item) }}
							</div>
						</div>
					</div>
<!-- 					<div class="ui orange right floated icon top left mini pointing dropdown button">
						<i class="icon tags"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<a class="item" v-on:click="setTag('is_archive')">Архив</a>
							<a class="item" v-on:click="setTag('is_conservation')">Консервация</a>
							<a class="item" v-on:click="setTag('is_check')">Поверка</a>
							<a class="item" v-on:click="setTag('is_repair')">Ремонт</a>
							<a class="item" v-on:click="setTag('is_working')">Используется</a>
						</div>
					</div> -->
					<div class="ui blue right floated icon top left mini pointing dropdown button">
						<i class="icon print"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<div class="item" v-on:click="GetSticker()">Этикетка</div>
							<div class="item" v-on:click="GetCard()">Регистрационная карта</div>
						</div>
					</div>
					<button class="ui green right floated mini icon button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
					<button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
					<a href="<?php echo Url::toRoute(['append/']) ?>" class="ui yellow right floated mini icon button" ><i class="icon plus"></i></a>
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
			<tr v-for="equipment in paginateRows">
				<td class="collapsing">
					<div class="ui checkbox">
						<input type="checkbox"
						v-bind:value="{id_equipment: equipment.id,is_archive: equipment.is_archive,is_conservation: equipment.is_conservation,is_repair: equipment.is_repair,is_check: equipment.is_check,is_working: equipment.is_working}" 
						v-model="selectedEquipments">
						<label></label>
					</div>
				</td>
				<td class="collapsing right aligned">{{ equipment.number }} / {{ equipment.id_department }} / {{ equipment.type }}</td>
				<td>{{ equipment.equipment }}</td>
				<td class="collapsing right aligned">{{ equipment.serial_number }}</td>
				<td class="collapsing">{{ equipment.date_current_check }}</td>
				<td class="collapsing">{{ equipment.date_next_check }}</td>
				<td class="collapsing">
<!-- 					<span  v-bind:class="{'ui yellow small circular label': equipment.is_conservation, 'ui teal small circular label': equipment.is_archive, 'ui red small circular label': equipment.is_repair, 'ui violet small circular label': equipment.is_check, 'ui green small circular label': equipment.is_working}"
					v-show="equipment.is_conservation || equipment.is_archive || equipment.is_repair || equipment.is_check || equipment.is_working"></span> -->
					<span class="ui violet small circular label" v-show="equipment.is_check">Ц</span>
					<span class="ui green small circular label" v-show="equipment.is_working">И</span>
					<span class="ui red small circular label" v-show="equipment.is_repair">Р</span>
					<span class="ui yellow small circular label" v-show="equipment.is_conservation">К</span>
					<span class="ui teal small circular label" v-show="equipment.is_archive">А</span>
				</td>
				<td class="collapsing">
					<div class="ui icon left pointing dropdown mini button">
						<i class="settings icon"></i>
						<div class="menu">
							<!-- <div class="item" v-on:click="Details('Handoff')">Подробнее</div> -->
							<a v-bind:href="'details/' + equipment.id" class="item">Подробнее</a>
							<div class="item" v-on:click="showModalHandoff('Handoff', equipment.id, equipment.department)">Перемещение</div>
							<div class="item" v-on:click="showModal('Check', equipment.id)">Поверка - Проверка</div>
						</div>
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