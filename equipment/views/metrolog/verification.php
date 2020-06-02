<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    // $this->registerJsFile('@web/assets/js/vivarium/arrival.js');
?>
<div class="row" id="arrival">
	<div class="three wide column">
		<div class="ui card">
			<div class="content">123</div>
		</div>
	</div>
    <div class="thirteen wide column">
    	<table class="ui table compact selectable">
    		<thead>
    			<tr>
    				<th>Сформировано</th>
    				<th>Отправлено</th>
    				<th>Получено</th>
    				<th>Статус</th>
    				<th></th>
    			</tr>
    		</thead>
    		<tbody>
    			<tr>
    				<td class="collapsing">12.12.1212</td>
    				<td class="collapsing">12.12.1212</td>
    				<td class="collapsing">12.12.1212</td>
    				<td class="collapsing">Подготовка</td>
    				<td class="one wide">
						<div class="ui small icon buttons">
							<button class="ui yellow button" type="button"><i class="icon eye"></i></button>
						</div>
    				</td>
    			</tr>
    		</tbody>
    	</table>
    </div>
</div>