<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/location.js');
?>
<div class="ui centered grid container">
	<div class="sixteen wide column" id="demo">
		<location-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:count-post="countPost"
			:locations="locations">
		</location-grid>
		<div id="modalCreate" class="ui tiny card modal">
			<div class="content">
				<div class="content header">
				Местоположение
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Кабинет</label>
							<input type="number" v-model="locations.cabinet_number">
						<label>Место (мебель)</label>
							<input type="text" v-model="locations.place">
						<label>Примечание</label>
							<textarea v-model="locations.notation"></textarea>
					</div>
				</div>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="createLocation()">Добавить</button>
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
						<label>Кабинет</label>
							<input type="text" v-model="locations.cabinet_number">
						<label>Место (мебель)</label>
							<input type="text" v-model="locations.place">
						<label>Примечание</label>
							<textarea v-model="locations.notation"></textarea>
					</div>
				</div>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="locationEdit()">Изменить</button>
				<button class="ui deny orange button">Отмена</button>
			</div>
		</div>
	</div>
</div>
<template id="location-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length">
					Местоположение
					<div class="ui right floated mini icon buttons">
						<button class="ui yellow button" v-on:click="showModal('Create')"><i class="icon plus"></i></button>
					</div>
				</th>
			</tr>
			<tr>
				<th v-for="key in columns">
					{{ Object.values(key)[0] }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="location in filteredRows">
				<td class="one wide">{{ location.cabinet_number }}</td>
				<td>{{ location.place }}</td>
				<td class="four wide">{{ location.notation }}</td>
				<td class="one wide">
					<div class="ui icon mini buttons">
						<button class="ui blue button" v-on:click="showModal('Edit', location.id, location.cabinet_number, location.place, location.notation)"><i class="icon edit"></i></button>
<!-- 								<button class="ui red button" v-on:click="locationDelete(location.id)"><i class="icon trash"></i></button> -->
					</div>
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th v-bind:colspan="columns.length">
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