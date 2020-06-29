<?php
	use yii\helpers\Url;
?>
<?php $this->beginContent('@app/modules/equipment/views/layouts/main.php'); ?>
	<div class="row">
		<div class="column">
			<div class="ui menu table-head">
				<div class="left menu">
					<a href="<?php echo Url::toRoute(['equipments/']) ?>" class="item">Оборудование</a>
					<a href="<?php echo Url::toRoute(['verification/']) ?>" class="item">Проверки</a>
					<a href="<?php echo Url::toRoute(['repair/']) ?>" class="item">Ремонт</a>
					<a href="<?php echo Url::toRoute(['plan-graph/']) ?>" class="item">План-график</a>
					<a href="<?php echo Url::toRoute(['fgis/']) ?>" class="item">ФГИС</a>
				</div>
			</div>
		</div>
	</div>
	<?= $content ?>
<?php $this->endContent(); ?>