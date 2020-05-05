<?php
	use yii\helpers\Url;
?>
<?php $this->beginContent('@app/modules/reagent/views/layouts/main.php'); ?>
	<div class="row">
		<div class="column">
			<div class="ui menu table-head">
				<div class="left menu">
					<a href="<?php echo Url::toRoute(['arrival/']) ?>" class="item">Поступление</a>
					<a href="<?php echo Url::toRoute(['expenses/']) ?>" class="item">Потребление</a>
					<a href="<?php echo Url::toRoute(['writeoff/']) ?>" class="item">Списание</a>
	                <div class="ui simple dropdown item">
	                    <span>Передача</span>
	                    <i class="dropdown icon"></i>
	                    <div class="menu">
	                        <a href="<?php echo Url::toRoute(['request-handoff/']) ?>" class="item">Запрос</a>
	                        <a href="<?php echo Url::toRoute(['history-handoff/']) ?>" class="item">История</a>
	                    </div>
	                </div>
				</div>
				<div class="right menu">
					<a href="<?php echo Url::toRoute(['location/']) ?>" class="item">Местоположение</a>
<!-- 	                <div class="ui simple dropdown item">
	                    <span>Список</span>
	                    <i class="dropdown icon"></i>
	                    <div class="menu">
	                        <a href="<?php echo Url::toRoute(['material/']) ?>" class="item">Материалы</a>
	                        <a href="<?php echo Url::toRoute(['location/']) ?>" class="item">Местоположение</a>
	                    </div>
	                </div> -->
				</div>
			</div>
		</div>
	</div>
	<?= $content ?>
<?php $this->endContent(); ?>