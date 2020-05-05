<?php
use yii\helpers\Html;
use frontend\assets\AppAsset;
use yii\helpers\Url;
AppAsset::register($this);
?>
<?php $this->beginPage() ?>
    <!DOCTYPE html>
    <html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php $this->registerCsrfMetaTags() ?>
        <title>УВДЦ - Оборудование</title>
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>
        <div class="ui pointing menu">
            <div class="left menu">
                <a href="<?php echo Url::toRoute(['equipment/']) ?>" class="item">Оборудование</a>
                <a href="<?php echo Url::toRoute(['plan/']) ?>" class="item">План-график</a>
                <a href="<?php echo Url::toRoute(['conservation/']) ?>" class="item">Консервация</a>
                <a href="<?php echo Url::toRoute(['archive/']) ?>" class="item">Архив</a>
                <a href="<?php echo Url::toRoute(['metrolog/']) ?>" class="item">Метролог</a>
            </div>
            <div class="right menu">
                <div class="item"><?php echo Yii::$app->user->identity['login'] ?></div>
                <a href="<?php echo Url::toRoute(['/logout']) ?>" class="item"><i class="icon sign out"></i></a>
            </div>
        </div>
        <div class="ui padded grid">
            <?= $content ?>
        </div>
    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>