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

	public function actionGetRegion()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$id = Yii::$app->request->get('vet');
			$region = gz_region::find()->where(['ID_VetStation' => $id])->all();
			foreach ($region as $r) {
				$arr[] = array(
					'id_reg' => $r->ID,
					'title' => $r->Title
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
		}
	}

	public function actionGetFarm()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$id = Yii::$app->request->get('region');
			$farm = gz_farm::find()->where(['ID_Region' => $id])->all();
			foreach ($farm as $r) {
				$arr[] = array(
					'id_farm' => $r->ID,
					'title' => $r->Title
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
		}
	}

	public function actionGetMethod()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$cache = Yii::$app->cache;
			$block = $cache->get('block');
			$vet = Yii::$app->request->get('vet');
			$animal = Yii::$app->request->get('animal');
			$method = gz_mpforvet::find()->select(['mp_id', 'method', 'vt_id', 'animal_id', 'id_block'])->where(['animal_id' => $animal, 'vt_id' => $vet, 'id_block' => $block])->all();
			foreach ($method as $r) {
				$arr[] = array(
					'id_method' => $r->mp_id,
					'title' => $r->method
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
		}
	}

	public function actionGetEmpl()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$empl = Yii::$app->request->get();
			$empls = empl::find()->all();
			foreach ($empls as $r) {
				$arr[] = array(
					'id_empl' => $r->ID,
					'title' => $r->Title
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
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
			foreach ($data['method'] as $mhd)
			{
				$pathdata = new gz_pathdata();
				$pathdata->ID_method_plan = $mhd;
				$pathdata->ID_animal  = $data['animal'];
				$pathdata->ID_farm  = $data['farm'];
				$pathdata->ID_region  = $data['region'];
				$pathdata->ID_vetstation = $data['vetstation'];
				$pathdata->DateAdd = $data['date'];
				$pathdata->date_enter = $data['date_enter'];
				$pathdata->Amount  = $data['amount'];
				$pathdata->ID_empl = $data['empl'];
				if($pathdata->save())
				{
					// $an = $cache->get('pathdata');
					$cache->set('pathdata', $this->actionGetData());
				}
			}
			return $this->redirect(['/assignment']);
		}
	}

	public function actionCreateFarm()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$farm = new gz_farm();
			$farm->Title  = $data['farm'];
			$farm->ID_Region = $data['id_reg'];
			$farm->save();
			return $this->asJson('200');
		}
	}
}