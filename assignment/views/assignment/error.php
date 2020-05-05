<?php
use yii\helpers\Html;

$this->title = $name;
// $this->layout = 'error';
?>
<div class="">
    <div class="">
        <?= nl2br(Html::encode($message)) ?>
    </div>
</div>