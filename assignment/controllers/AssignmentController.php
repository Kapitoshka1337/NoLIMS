<?php
namespace app\modules\assignment\controllers;

use Yii;
// use yii\web\Controller;
// use yii\data\Pagination;

use app\modules\assignment\models\gz_getall;
use app\modules\assignment\models\gz_getall2;
use app\modules\assignment\models\gz_getall3;
use app\modules\assignment\models\gz_pathdata;
use app\modules\assignment\models\gz_vetstation;
use app\modules\assignment\models\gz_region;
use app\modules\assignment\models\gz_farm;
use app\modules\assignment\models\gz_animal;
use app\modules\assignment\models\gz_method;
use app\modules\assignment\models\gz_mpforvet;
use app\modules\assignment\models\gz_empl;
use app\modules\assignment\models\gz_blockofyear;

class AssignmentController extends GlobalController
{
	public function beforeAction($action)
	{
		if ($action->id == 'create-record' || $action->id == 'create-farm')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ]
        ];
    }


	public function actionIndex()
	{
		$cache = Yii::$app->cache;

		$an = $cache->get('animal');
		if ($an === false)
		{
			$animal = gz_animal::find();
			$animals = $animal->all();
			$arr = array();
			foreach ($animals as $ani) {
				$arr[] = array(
					'id_animal' => $ani->ID,
					'title' => $ani->Title,
				);
			}
			$an = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			$cache->set('animal', $an);
		}

		$data = $cache->get('vetreg');
		if ($data === false)
		{
			$vetstation = gz_vetstation::find();
			$region = gz_region::find();
			$vets = $vetstation->all();
			$regions = $region->all();
			$arr = array();
			$reg = array();
			foreach ($vets as $vet) {
				foreach ($regions as $region) {
					if ($vet->ID == $region->ID_VetStation)
					{
						$reg[] = array(
								'id_reg' => $region->ID,
								'title' => $region->Title,
							);
					}
				}
				$arr[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'regions' => $reg );
				unset($reg);
				$data = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			}
			$cache->set('vetreg', $data);
		}

		$method = $cache->get('method');
		if ($method === false)
		{
			$mp = gz_method::find();
			$mps = $mp->all();
			$arr = array();
			foreach ($mps as $ani) {
				$arr[] = array(
					'id' => $ani->ID,
					'title' => $ani->Title,
				);
			}
			$method = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			$cache->set('method', $method);
		}
		//Определение текущего квартала
			$block = gz_blockofyear::find()->all();
			$today = date('Y-m-d');
			foreach ($block as $bl)
			{
				$start = $bl->start;
				$end = $bl->end;
				if ((strtotime($today) >= strtotime($start)) && (strtotime($today) <= strtotime($end)))
				{
					$cache->set('block', $bl->ID);
				}
			}
		$block = $cache->get('block');
		return $this->render('index', ['data' => $block]);
	}

	public function actionGetData()
	{
		if(Yii::$app->request->isGet)
		{
			$query = gz_getall::find()->all();
			$cache = Yii::$app->cache;
			if($cache->get('pathdata'))
			{
				return $this->asJson($cache->get('pathdata'));
			}
			else 
			{
				$cache->set('pathdata', $query);
				return $this->asJson($query);
			}
		}
	}

	public function actionReport()
	{
		return $this->render('report');
	}

	public function actionAdd()
	{
		$cache = Yii::$app->cache;
		$an = $cache->get('animal');
		$data = $cache->get('vetreg');
		return $this->render('add', ['data' => $data, 'animal' => $an]);
	}

	public function actionGetVetstation()
	{
		if(Yii::$app->request->isGet)
		{
			$vetstation = gz_vetstation::find()->all();
			return $this->asJson($vetstation);
		}
	}

	public function actionGetAnimal()
	{
		if(Yii::$app->request->isGet)
		{
			$vetstation = gz_animal::find()->all();
			return $this->asJson($vetstation);
		}
	}

	public function actionGetRegion()
	{
		if(Yii::$app->request->isGet)
		{
			$vetstation = gz_region::find()->all();
			return $this->asJson($vetstation);
		}
	}

	public function actionGetFarm()
	{
		if(Yii::$app->request->isGet)
		{
			$vetstation = gz_farm::find()->all();
			return $this->asJson($vetstation);
		}
	}

	public function actionGetMethod()
	{
		if(Yii::$app->request->isGet)
		{
			$cache = Yii::$app->cache;
			$block = $cache->get('block');
			$vetstation = gz_mpforvet::find()->where(['id_block' => $block])->all();
			return $this->asJson($vetstation);
		}
	}

	public function actionGetReport()
	{
		if(Yii::$app->request->isGet)
		{
			$get = Yii::$app->request->get('num');
			switch($get)
			{
				case 2:
					$report = gz_getall2::find()->all();
					return $this->asJson($report);
					break;
				case 3:
					$report = gz_getall3::find()->all();
					return $this->asJson($report);
					break;
			}
		}
	}

	public function actionCreateRecord()
	{
		if (Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$cache = Yii::$app->cache;
			foreach ($data['id_method'] as $mhd)
			{
				$pathdata = new gz_pathdata();
				$pathdata->ID_method_plan = $mhd;
				$pathdata->ID_animal  = $data['id_animal'];
				$pathdata->ID_farm  = $data['id_farm'];
				$pathdata->ID_region  = $data['id_region'];
				$pathdata->ID_vetstation = $data['id_vetstation'];
				$pathdata->DateAdd = $data['date'];
				$pathdata->date_enter = date('Y-m-d');
				$pathdata->Amount  = $data['amount'];
				$pathdata->ID_empl = Yii::$app->user->identity['id'];
				$pathdata->place_of_selection = $data['place'];
				if($pathdata->save())
				{
					// $an = $cache->get('pathdata');
					$cache->set('pathdata', $this->actionGetData());
				}
			}
			return Yii::$app->response->statusCode = 200;
		}
	}

	public function actionCreateFarm()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$farm = new gz_farm();
			$farm->Title  = $data['farm'];
			$farm->ID_Region = $data['id_region'];
			if($farm->save())
				return Yii::$app->response->statusCode = 200;
		}
	}
}