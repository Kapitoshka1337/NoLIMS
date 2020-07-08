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
			:filters-check="checks"
			:filter-date="dateFilter"
			:count-post="countPost"
			:check-Eq="check"
			:handoff="handoff"
			@request="setSelectedEquipments"
			@clear="clearDate">
		</equipment-grid>
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
				<div class="field">
					<label>Дата следующей проверки (от)</label>
					<input type="date" v-model="dateFilter.start">
				</div>
				<div class="field">
					<label>Дата следующей проверки (по)</label>
					<input type="date" v-model="dateFilter.end">
				</div>
			</div>
		</div>
	</div>
	<div id="modalHandoff" class="ui tiny card modal">
		<div class="content">
			<div class="header">Перемещение оборудования</div>
			<div class="meta">{{ handoff.department }}</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="two fields">
					<div class="field">
						<label>Переместить в отдел</label>
						<select class="ui search dropdown" v-model="handoff.id_department_to">
							<option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
						</select>
					</div>
					<div class="field">
						<label>Кабинет</label>
						<select class="ui search dropdown" v-model="handoff.id_location">
							<option v-for="location in filteredLocation" v-bind:value="location.id">{{ location.cabinet_number }}</option>
						</select>
					</div>
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
			<div class="header">Добавление пройденой проверки <span v-if="checkEquipment">({{ checkEquipment.number_card }})</span></div>
			<div v-if="checkEquipment" class="meta">
				{{ checkEquipment.equipment }}, {{ checkEquipment.model }}
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="inline field">
					<div class="ui checkbox">
						<input type="checkbox" v-model="check.is_archive">
						<label>Переместить в архив</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="check.is_conservation">
						<label>Переместить в консервацию</label>
					</div>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div v-bind:class="{'two fields': !check.is_archive && !check.is_conservation}">
					<div class="field">
						<label>Текущая (пройденная)</label>
						<input type="date" v-model="check.date_current_check">
					</div>
					<div class="field" v-show="!check.is_archive && !check.is_conservation">
						<label>Cледующая (предстоящая)</label>
						<input type="date" v-model="check.date_next_check">
					</div>
				</div>
				<div class="field">
					<label>Загружамый файл</label>
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
	<div id="modalCheckReq" class="ui large card modal">
		<div class="content">
			<div class="content header">Подготавливаемое оборудования на проверку</div>
		</div>
		<div class="scrolling content">
			<table class="ui compact selectable table">
				<thead>
					<tr>
						<th>Номер</th>
						<th>Оборудование</th>
						<th>Модель</th>
						<th>Текущая</th>
						<th>Следующая</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
						<tr v-for="(equipment, k) in selectedEquipments">
							<td class="collapsing right aligned">{{ equipment.number }} / {{ equipment.number_department }} - {{ equipment.type }}</td>
							<td>{{ equipment.equipment }}</td>
							<td>{{ equipment.model }}</td>
							<td class="collapsing">{{ today(equipment.date_current_check) }}</td>
							<td class="collapsing">{{ today(equipment.date_next_check) }}</td>
							<td>
								<div class="ui small icon buttons">
									<button class="ui red button" type="button" v-on:click="deleteMaterial(k, equipment)"><i class="icon trash"></i></button>
								</div>
							</td>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="sendRequest()">Сформировать</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
	<div id="modalProtocol" class="ui tiny card modal">
		<div class="content">
			<div class="content header">ПТС</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Дата проведения</label>
					<input type="date" v-model="dateProtocol">
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="printProtocol()">Печать</button>
		</div>
	</div>
</div>
<template id="equipment-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					Оборудование
					<button class="ui violet right floated mini icon button" v-on:click="showModal('CheckReq')"><i class="icon calendar check outline"></i></button>
					<div class="ui orange right floated icon top right mini pointing dropdown button">
						<i class="icon tags"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<div class="header">
								<i class="tags icon"></i>
								Поставить метку
							</div>
							<div class="item" v-on:click="setTag('is_archive', true)">
								<div class="ui teal empty circular label"></div>
								Архив
							</div>
							<div class="item" v-on:click="setTag('is_working', true)">
								<div class="ui green empty circular label"></div>
								Используется
							</div>
							<div class="item" v-on:click="setTag('is_conservation', true)">
								<div class="ui yellow empty circular label"></div>
								Консервация
							</div>
							<div class="item" v-on:click="setTag('is_repair', true)">
								<div class="ui red empty circular label"></div>
								Ремонт
							</div>
							<div class="item" v-on:click="setTag('is_check', true)">
								<div class="ui violet empty circular label"></div>
								ЦСМ
							</div>
							<div class="divider"></div>
							<div class="header" v-show="selectedEquipments.length > 0">
								<i class="tags icon"></i>
								Снять метку
							</div>
							<div class="item" v-for="item in Object.keys(tagsFromSelected)" v-on:click="setTag(item, false)">
								<div v-bind:class="{
								'ui violet empty circular label': item === 'is_check',
								'ui red empty circular label': item === 'is_repair',
								'ui yellow empty circular label': item === 'is_conservation',
								'ui green empty circular label': item === 'is_working',
								'ui teal empty circular label': item === 'is_archive'}"></div>
								{{ tagsFromSelected[item] }}
							</div>
						</div>
					</div>
					<div class="ui blue right floated icon top left mini pointing dropdown button">
						<i class="icon print"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<div class="item" v-on:click="GetSticker()">Этикетка</div>
							<div class="item" v-on:click="GetCard()">Регистрационная карта</div>
							<div class="item" v-on:click="printTable()">Таблица проверок</div>
							<div class="item" v-on:click="showModal('Protocol')">ПТС</div>
						</div>
					</div>
					<button class="ui green right floated mini icon button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
					<button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
					<a href="<?php echo Url::toRoute(['append/']) ?>" class="ui yellow right floated mini icon button" ><i class="icon plus"></i></a>
				</th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui form"><div class="field"><input type="text" placeholder="Поиск" v-model="filterKey"></div></div>
				</th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_archive">
						<label>Архив</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_working">
						<label>Используется</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_conservation">
						<label>Консервация</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_repair">
						<label>Ремонт</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_check">
						<label>ЦСМ</label>
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
			<tr v-for="equipment in paginateRows">
				<td class="collapsing">
					<div class="ui checkbox">
						<input type="checkbox"
						v-bind:value="{id_equipment: equipment.id,is_archive: equipment.is_archive,is_conservation: equipment.is_conservation,is_repair: equipment.is_repair,is_check: equipment.is_check,is_working: equipment.is_working,
						number: equipment.number, number_department: equipment.number_department, id_department: equipment.id_department, type: equipment.type, model: equipment.model,
						date_current_check: equipment.date_current_check, date_next_check: equipment.date_next_check, equipment: equipment.equipment}" 
						v-model="selectedEquipments">
						<label></label>
					</div>
				</td>
				<td class="collapsing">{{ equipment.number_card }}</td>
				<td>{{ equipment.equipment }}</td>
				<td class="collapsing">{{ equipment.model }}</td>
				<td class="collapsing right aligned">{{ equipment.serial_number }}</td>
				<td class="collapsing">{{ today(equipment.date_current_check) }}</td>
				<td class="collapsing">{{ today(equipment.date_next_check) }}</td>
				<td class="collapsing">
					<a><span class="ui teal small circular label" v-show="equipment.is_archive">А</span></a>
					<a><span class="ui green small circular label" v-show="equipment.is_working">И</span></a>
					<a><span class="ui yellow small circular label" v-show="equipment.is_conservation">К</span></a>
					<a><span class="ui red small circular label" v-show="equipment.is_repair">Р</span></a>
					<a><span class="ui violet small circular label" v-show="equipment.is_check">Ц</span></a>
				</td>
				<td class="collapsing">
					<div class="ui icon left pointing dropdown mini button">
						<i class="settings icon"></i>
						<div class="menu">
							<!-- КОСТЫЛЬ v-bind:href="'details/' + equipment.id" --> 
							<a v-bind:href="'edit/' + equipment.id" class="item">Подробнее</a>
							<div class="item" v-on:click="showModalHandoff('Handoff', equipment.id, equipment.department)">Перемещение</div>
							<div class="item" v-on:click="showModal('Check', equipment.id)">Проверка</div>
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
					<!-- <div class="ui left floated label">Cтрок {{lenghtPaginated}} из {{filteredRows.length}}</div> -->
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