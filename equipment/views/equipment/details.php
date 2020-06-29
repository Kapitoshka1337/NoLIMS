<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/user_equipment_details.js');
?>
<div class="row" id="details">
	<div class="sixteen wide column">
		<div class="ui form">
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Идентификационные данные</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="two fields">
							<div class="field">
								<label>Наименование</label>
								<textarea cols="30" rows="2" v-model="listDetails.equipment.title" readonly></textarea>
							</div>
							<div class="field">
								<label>Производитель</label>
								<textarea cols="30" rows="2" v-model="listDetails.equipment.manufacturer" readonly></textarea>
							</div>
						</div>
						<div class="four fields">
							<div class="field">
								<label>Инвентарный номер</label>
								<input type="text" v-model="listDetails.equipment.inventory_number" readonly>
							</div>
							<div class="field">
								<label>Серийный номер</label>
								<input type="text" v-model="listDetails.equipment.serial_number" readonly>
							</div>
							<div class="field">
								<label>Модель</label>
								<input type="text" v-model="listDetails.equipment.model" readonly>
							</div>
							<div class="field">
								<label>Дата изготовления</label>
								<input type="date" v-model="listDetails.equipment.date_create" readonly>
							</div>
						</div>
						<div class="two fields">
							<div class="field">
								<label>Номер</label>
								<input type="text" v-model="listDetails.equipment.number" readonly>
							</div>
							<div class="field">
								<label>ФИФ</label>
								<input type="text" v-model="listDetails.equipment.fif_number" readonly>
							</div>
						</div>
						<div class="field">
							<label>Дата ввода в эксплуатацию</label>
							<input type="date" v-model="listDetails.equipment.date_commissioning" readonly>
						</div>
						<div class="field">
							<label>Примечание</label>
							<textarea cols="30" rows="2" v-model="listDetails.equipment.description" readonly></textarea>
						</div>
					</div>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Состояние</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="inline fields">
							<div class="field">
								<div class="ui checkbox">
									<input type="checkbox" v-model="listDetails.equipment.is_archive" disabled>
									<label>Архив</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input type="checkbox" v-model="listDetails.equipment.is_working" disabled>
									<label>Используется</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input type="checkbox" v-model="listDetails.equipment.is_conservation" disabled>
									<label>Консервация</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input type="checkbox" v-model="listDetails.equipment.is_repair" disabled>
									<label>Ремонт</label>
								</div>
							</div>
							<div class="field">
								<div class="ui checkbox">
									<input type="checkbox" v-model="listDetails.equipment.is_check" disabled>
									<label>ЦСМ</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Местоположение</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="two fields">
							<div class="field">
								<label>Отдел</label>
								<select class="ui search dropdown disabled" v-model="listDetails.equipment.id_department" disabled>
									<option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
								</select>
							</div>
							<div class="field">
								<label>Кабинет</label>
								<select class="ui search dropdown" v-model="listDetails.equipment.id_location" disabled>
									<option v-for="location in filteredLocation" v-bind:value="location.id">{{ location.cabinet_number }}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">История проверок</div>
				</div>
				<div class="content">
					<table class="ui compact table" v-if="listDetails.history_check || listDetails.current_check">
						<thead>
							<tr>
								<th>Текущая</th>
								<th>Следующая</th>
								<th>Вид документа</th>
								<th>Документ</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="check in listDetails.history_check">
								<td>{{ today(check.date_current_check) }}</td>
								<td>{{ today(check.date_next_check) }}</td>
								<td>{{ check.document_type }}</td>
								<td>
									<a v-if="check.upload_file_name" v-bind:href="'/assets/uploads/' + check.upload_file_name" target="_blank">Открыть</a>
									<span v-if="!check.upload_file_name">Не загружен</span>
								</td>
							</tr>
							<tr>
								<td>{{ today(listDetails.current_check.date_current_check) }}</td>
								<td>{{ today(listDetails.current_check.date_next_check) }}</td>
								<td>{{ listDetails.current_check.document_type }}</td>
								<td>
									<a v-if="listDetails.current_check.upload_file_name" v-bind:href="'/assets/uploads/' + listDetails.current_check.upload_file_name" target="_blank">Открыть</a>
									<span v-if="!listDetails.current_check.upload_file_name">Не загружен</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Перемещения</div>						
				</div>
				<div class="content">
					<table class="ui compact table" v-if="listDetails.history_moving">
						<thead>
							<tr>
								<th>Прошлый отдел</th>
								<th>Текущий отдел</th>
								<th>Прошлый кабинет</th>
								<th>Текущий кабинет</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="moving in listDetails.history_moving">
								<td>{{ moving.current_department }}</td>
								<td>{{ moving.next_department }}</td>
								<td>{{ moving.current_location }}</td>
								<td>{{ moving.next_location }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Характеристки</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="field">
							<label>Вид</label>
							<select class="ui search dropdown" v-model="listDetails.equipment.id_equipment_type" disabled>
								<option v-for="type in listDetails.types.type" v-bind:value="type.id">{{ type.title }}</option>
							</select>
						</div>
						<div class="two fields">
							<div class="field">
								<label>Диапазон измерений</label>
								<input type="text" v-model="listDetails.equipment.measuring_range" readonly>
							</div>
							<div class="field">
								<label>Диапазон работы</label>
								<input type="text" v-model="listDetails.equipment.measuring_work" readonly>
							</div>
						</div>
						<div class="two fields">
							<div class="field">
								<label>Точность <span>(<span v-on:click="addPlus()">±</span> / <span v-on:click="addTemp()">°</span>)</span></label>
								<input type="text" v-model="listDetails.equipment.accuracy" readonly>
							</div>
							<div class="field">
								<label>Класс точности</label>
								<input type="text" v-model="listDetails.equipment.class_accuracy" readonly>
							</div>
						</div>
						<div class="three fields">
							<div class="field">
								<label>Цель использования</label>
								<input type="text" v-model="listDetails.equipment.purpose_of_use" readonly>
							</div>
							<div class="field">
								<label>Объект исследования</label>
								<select class="ui search dropdown" v-model="listDetails.equipment.id_object_study" disabled>
									<option v-for="object in listObjectStudy" v-bind:value="object.id">{{ object.title }}</option>
								</select>
							</div>
							<div class="field">
								<label>Функциональное значение</label>
								<select class="ui search dropdown" v-model="listDetails.equipment.id_function_of_use" disabled>
									<option v-for="location in filteredFunctionOfUse" v-bind:value="location.id">{{ location.title }}</option>
								</select>
							</div>
						</div>
						<div class="field">
							<label>Дополнительные характеристики</label>
							<textarea cols="30" rows="2" v-model="listDetails.equipment.characteristics" readonly></textarea>
						</div>
					</div>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<div class="header">Условия работы</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="three fields">
							<div class="field">
								<label>Влажность</label>
								<input type="text" v-model="listDetails.condition_working.humidity" readonly>
							</div>
							<div class="field">
								<label>Давление</label>
								<input type="text" v-model="listDetails.condition_working.pressure" readonly>
							</div>
							<div class="field">
								<label>Температура</label>
								<input type="text" v-model="listDetails.condition_working.temperature" readonly>
							</div>
						</div>
						<div class="two fields">
							<div class="field">
								<label>Напряжение</label>
								<input type="number" v-model="listDetails.condition_working.voltage" readonly>
							</div>
							<div class="field">
								<label>Ток</label>
								<input type="number" v-model="listDetails.condition_working.amperage" readonly>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui fluid card">
				<div class="content">
					<table class="ui compact table" v-if="listDetails.maintenance">
						<thead>
							<tr>
								<th>Вид ТО</th>
								<th>Исполнитель</th>
								<th>Периодичность</th>
								<th>ТО</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="maintenance in listDetails.maintenance">
								<td>{{ maintenance.type_maintenance }}</td>
								<td>{{ maintenance.executor }}</td>
								<td>{{ maintenance.periodicity }}</td>
								<td>{{ maintenance.description }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>