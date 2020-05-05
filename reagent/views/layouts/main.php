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
        <title>УВДЦ - Реактив</title>
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>
        <div class="ui pointing menu">
            <div class="left menu">
                <a href="<?php echo Url::toRoute(['/reagent']) ?>" class="item">Главная</a> 
                <a href="<?php echo Url::toRoute(['storage/']) ?>" class="item">Склад</a>
                <a href="<?php echo Url::toRoute(['archive/']) ?>" class="item">Архив</a> 
                <a href="<?php echo Url::toRoute(['error/']) ?>" class="item">Ошибки</a>
                <a href="<?php echo Url::toRoute(['request/']) ?>" class="item">Заявки</a>
            </div>
            <div class="right menu">
                <div class="item"><?php echo Yii::$app->user->identity['login'] ?></div>
                <a href="<?php echo Url::toRoute(['/logout']) ?>" class="item"><i class="icon sign out"></i></a>
<!--                 <div id="drop" class="ui dropdown item">
                    <i class="user icon"></i>
                </div>
                <div class="ui popup" >
                    <div class="ui card">
                        <div class="content">
                            <div class="center aligned header"><?php echo Yii::$app->user->identity['login'] ?></div>
                            <div class="center aligned header"><?php echo Yii::$app->user->identity['id_department'] ?></div>
                        </div>
                        <div class="content">
                            <div class="ui tiny attached buttons"><a href="<?php echo Url::toRoute(['/logout']) ?>" class="ui orange button">Выход</a></div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="ui padded grid">
            <?= $content ?>
        </div>
        <script>
            $('#drop').popup({on: 'hover', inline: true, hoverable: true, position: 'bottom right'});
        </script>
    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>