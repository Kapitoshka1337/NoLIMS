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
        <title>УВДЦ - Госзадание</title>
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>
        <div class="ui pointing menu">
            <div class="left menu">
                <a href="<?php echo Url::toRoute(['/assignment']) ?>" class="item">Госзадание</a>
                <a href="<?php echo Url::toRoute(['report/']) ?>" class="item">Отчет</a>
                <div class="ui simple dropdown item">
                    <span>План</span>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <a href="<?php echo Url::toRoute(['view/']) ?>" class="item">Просмотр</a>
                        <a href="<?php echo Url::toRoute(['edit/']) ?>" class="item">Редактировать</a>
                    </div>
                </div>
            </div>
            <div class="right menu">
                <div class="item"><?php echo Yii::$app->user->identity['login'] ?></div>
                <a href="<?php echo Url::toRoute(['/logout']) ?>" class="item"><i class="icon sign out"></i></a>
            </div>
        </div>
        <div class="ui padded grid">
            <?= $content ?>
        </div>
        <script>
            $('#drop')
  .popup({
    on         : 'hover',
    inline     : true,
    hoverable  : true,
    position   : 'bottom right',
  });
        </script>
    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>