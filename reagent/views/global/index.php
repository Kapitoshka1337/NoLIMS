<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/reagent/global.js');
?>
<div class="column">
    <div class="ui three cards">
		<div class="card">
			<div class="content">
				<div class="center aligned header">Остатки</div>
			</div>
			<div class="content">
				<div class="ui small feed">
					Материалы, которые скоро закончатся
				</div>
			</div>
			<div class="extra content">
				<div class="ui right floated icon tiny buttons">
					<a href="#" class="ui yellow button"><i class="icon plus"></i></a>
					<a href="#" class="ui red button"><i class="icon eye"></i></a>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="center aligned header">Срок хранения</div>
			</div>
			<div class="content">
				<div class="ui small feed">
					Материалы у которых заканчивается СХ
				</div>
			</div>
			<div class="extra content">
				<div class="ui right floated icon tiny buttons">
					<a href="#" class="ui yellow button"><i class="icon plus"></i></a>
					<a href="#" class="ui red button"><i class="icon eye"></i></a>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="center aligned header">Запросы на передачу</div>
			</div>
			<div class="content" id="handoff">
				<div class="ui small feed">
					<div class="ui relaxed divided list">
						<div class="item" v-for="order in filteredRows">
							<div class="right floated content">
								<div class="ui icon tiny three buttons" v-if="order.id_handoff_status != 2 && order.id_handoff_status != 3 && order.id_department_from != <?php echo Yii::$app->user->identity['id_department'] ?>">
									<button class="ui green button" v-on:click="requestApprove(order.id, order.id_department_from, order.materials)"><i class="icon check"></i></button>
									<button class="ui red button" v-on:click="requestDeclining(order.id)"><i class="icon ban"></i></button>
									<button class="ui yellow button" v-on:click="showModal('Material')"><i class="icon eye"></i></button>
								</div>
							</div>
							<i class="large yellow question middle aligned icon"></i>
							<div class="content">
								<span class="header">{{ order.materials[0].department_from }} ({{ order.materials[0].user }}) -> {{ order.materials[0].department_to }}</span>
							<div class="description">Запрос / Ответ: {{ order.date_request }} / {{ order.date_handoff }}</div>
							</div>
							<div id="modalMaterial" class="ui large card long coupled modal">
								<div class="content">
									<div class="header">
										Запрашиваемые материалы
									</div>
								</div>
								<div class="content">
									<table class="ui compact selectable table">
										<thead>
											<tr>
												<th v-for="key in gridColumns.tableColumn">
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
		</div>
	</div>
</div>