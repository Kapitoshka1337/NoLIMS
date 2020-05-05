<?php

namespace app\modules\reagent\controllers;
use yii\web\Controller;

class RequestController extends Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }

}
