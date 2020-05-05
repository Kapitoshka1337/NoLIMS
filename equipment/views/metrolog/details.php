<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_equipment_details.js');
?>
<div class="row" id="details">
	<input type="text" v-bind:value="<?php echo $id?>" v-model="id_eq">
	{{ id_eq }}
	<div class="sixteen wide column">
		<div class="ui form">
			<div class="ui fluid card">
				<div class="content">
					<div class="three fields">
						<div class="field">
							<input type="text" value="<?php echo $eq['department'] ?>">
						</div>
						<div class="field">
							<input type="text" value="<?php echo $eq['equipment'] ?>">
						</div>
						<div class="field">
							<input type="text" value="<?php echo $eq['equipment_type'] ?>">
						</div>
					</div>
					EQUIPMENT
					
					
					<?php echo $eq['serial_number'] ?>
					<?php echo $eq['manufacturer'] ?>
					<?php echo $eq['date_create'] ?>
					<?php echo $eq['inventory_number'] ?>
					<?php echo $eq['model'] ?>
				</div>
				<div class="content">
					LOCATION
					<?php echo $eq['cabinet_number'] ?>
					<?php echo $eq['place'] ?>
					<?php echo $eq['notation'] ?>
				</div>
				<div class="content">
					CHARACTERISTICS
					<?php echo $eq['measuring_range'] ?>
					<?php echo $eq['measuring_work'] ?>
					<?php echo $eq['characteristics'] ?>
					<?php echo $eq['accuracy'] ?>
					<?php echo $eq['class_accuracy'] ?>
					<?php echo $eq['purpose_of_use'] ?>
					<?php echo $eq['fif_number'] ?>
					<?php echo $eq['object_study'] ?>
					<?php echo $eq['function_of_use'] ?>
				</div>
				<div class="content">
					IS BOOL
					<?php echo $eq['is_conservation'] ?>
					<?php echo $eq['is_archive'] ?>
					<?php echo $eq['is_repair'] ?>
				</div>
			</div>
		</div>
	    <h1><?php echo $id?></h1>
	    <?php var_dump($eq) ?>
	</div>
</div>
<!-- id
id_department
id_equipment_type
id_function_of_use
id_object_study
number
title
measuring_range
measuring_work
characteristics
accuracy
class_accuracy
purpose_of_use
is_conservation
fif_number
model
serial_number
manufacturer
date_create
inventory_number
id_location
is_archive
is_repair -->