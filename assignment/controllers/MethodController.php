<?php

namespace app\modules\assignment\controllers;

use Yii;
use app\modules\assignment\models\gz_animal;
use app\modules\assignment\models\gz_method;
use app\modules\assignment\models\gz_farm;
use app\modules\assignment\models\gz_region;

class MethodController extends GlobalController
{
    public function actionAnimal()
    {
        //$query = animal::find()->all();
        return $this->render('animal', ['animals' => $query]);
    }

    public function actionMethod()
    {
        //$query = method::find()->all();
        return $this->render('method');
    }

    public function actionFarm()
    {
        //$query = farm::find()->all();
        return $this->render('farm');
    }

    public function actionGetAnimal()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_animal::find()->all();
            return $this->asJson($query);
        }
    }

    public function actionGetMethods()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_method::find()->all();
            return $this->asJson($query);
        }
    }

    public function actionGetFarms()
    {
        if(Yii::$app->request->isGet)
        {
            $farms = gz_farm::find()->all();
            $regions = gz_region::find()->all();
            $arr = array();
            $far = array();
            foreach ($regions as $region)
            {
                foreach ($farms as $farm)
                {
                    if($region->ID === $farm->ID_Region)
                        $far[] = array(
                            'title' => $farm->Title,
                            'id' => $farm->ID
                        );
                }
                $arr[] = array('region' => $region->Title, 'farm' => $far, 'farmCount' => $i);
                unset($far);
            }
            return $this->asJson($arr);
        }
    }

    public function actionCreateAnimal()
    {
        if(Yii::$app->request->isGet)
        {
            $model = new gz_animal();
            $model->Title = Yii::$app->request->get('animal');
            $model->save();
            return $this->asJson($model);
        }
    }

    public function actionCreateMethod()
    {
        if(Yii::$app->request->isGet)
        {
            $model = new gz_method();
            $model->Title = Yii::$app->request->get('method');
            $model->save();
            return $this->asJson($model);
        }
    }

    public function actionDeleteAnimal()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_animal::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->delete();
            return $this->asJson($query);
        }
    }

    public function actionDeleteMethod()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_method::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->delete();
            return $this->asJson($query);
        }
    }

    public function actionDeleteFarm()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_farm::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->delete();
            return $this->asJson($query);
        }
    }

    public function actionEditAnimal()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_animal::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->Title = Yii::$app->request->get('title');
            $query->save();
            return $this->asJson($query);
        }
    }

    public function actionEditMethod()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_method::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->Title = Yii::$app->request->get('title');
            $query->save();
            return $this->asJson($query);
        }
    }

    public function actionEditFarm()
    {
        if(Yii::$app->request->isGet)
        {
            $query = gz_farm::find()->where(['ID' => Yii::$app->request->get('id')])->one();
            $query->Title = Yii::$app->request->get('title');
            $query->save();
            return $this->asJson($query);
        }
    }
}