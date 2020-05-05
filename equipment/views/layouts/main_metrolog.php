<?php
	use yii\helpers\Url;
?>
<?php $this->beginContent('@app/modules/equipment/views/layouts/main.php'); ?>
	<div class="row">
		<div class="column">
			<div class="ui menu table-head">
				<div class="left menu">
					<a href="<?php echo Url::toRoute(['equipments/']) ?>" class="item">Оборудование</a>
					<a href="<?php echo Url::toRoute(['certification/']) ?>" class="item">Аттестация</a>
					<a href="<?php echo Url::toRoute(['plan-graph/']) ?>" class="item">План-график</a>
					<a href="<?php echo Url::toRoute(['verification/']) ?>" class="item">Проверки</a>
					<a href="<?php echo Url::toRoute(['fgis/']) ?>" class="item">ФГИС</a>
<!-- 	                <div class="ui simple dropdown item">
	                    <span>Передача</span>
	                    <i class="dropdown icon"></i>
	                    <div class="menu">
	                        <a href="<?php echo Url::toRoute(['request-handoff/']) ?>" class="item">Запрос</a>
	                        <a href="<?php echo Url::toRoute(['history-handoff/']) ?>" class="item">История</a>
	                    </div>
	                </div> -->
				</div>
				<div class="right menu">
					<!-- <a href="<?php echo Url::toRoute(['equipments/']) ?>" class="item">Оборудование</a> -->
				</div>
			</div>
		</div>
	</div>
	<?= $content ?>
<?php $this->endContent(); ?>