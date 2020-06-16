<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/equipment/plan.js');
?>
<div class="row">
	<div class="column">
		<div class="ui fluid card">
			<div class="content">
				<button class="ui left floated orange button"><</button>
				<button class="ui right floated orange button">></button>
				<div class="header center aligned">Месяц</div>
				<div class="meta center aligned">Год</div>
			</div>
			<div class="content">
				<table class="ui compact table">
					<thead>
						<tr>
							<th>Номер</th>
							<th>Оборудование</th>
							<th>Дата проверки</th>
							<th>Вид проверки</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Номер</td>
							<td>Оборудование</td>
							<td>Дата проверки</td>
							<td>Вид проверки</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>