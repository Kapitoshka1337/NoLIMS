<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
?>
<div class="column">
    <h1><?= $this->context->action->uniqueId ?></h1>
</div>