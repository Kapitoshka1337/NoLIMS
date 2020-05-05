<?php
namespace app\modules\assignment\controllers;
use Yii;
// use yii\web\Controller;

use app\modules\assignment\models\gz_vetstation;
use app\modules\assignment\models\gz_animal;
use app\modules\assignment\models\gz_method;
use app\modules\assignment\models\gz_viewplan;
use app\modules\assignment\models\gz_viewplan1;
use app\modules\assignment\models\gz_methodplan;
use app\modules\assignment\models\gz_methodplanyear;

class PlanController extends GlobalController
{
	public function beforeAction($action)
	{
		if ($action->id == 'plan-create' || $action->id == 'plan-create-block' || $action->id == 'edit' || $action->id == 'update')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionView()
	{
		$viewplan = gz_viewplan1::find()->all();
		$vetstation = gz_vetstation::find()->all();
		$animals = gz_animal::find()->all();
		$blocks = array();
		$animalss = array();
		foreach ($vetstation as $vet)
		{
			foreach ($animals as $anim)
			{
				foreach ($viewplan as $plan)
				{
					if($vet->ID == $plan->id_vet && $anim->ID == $plan->id_animal)
					{
						$blocks[] = array(
							'method' => $plan->method,
							'block' => $plan->block,
							'block_plan' => $plan->block_plan,
							'plan' => $plan->plan,
						);
					}
				}
				$animalss[] = array('animal' => $anim->Title, 'blocks' => $blocks);
				unset($blocks);
			}
			$plans[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'animals' => $animalss);
			unset($animalss);
		}
		return $this->render('plan', ['plans' => $plans]);
		// foreach ($vetstation as $vet)
		// {
		// 	foreach ($viewplan as $plan)
		// 	{
		// 		if ($vet->ID == $plan->id_vet)
		// 		{
		// 			$arr[] = array(
		// 				'id' => $plan->id_animal,
		// 				'title' => $plan->animal
		// 			);
		// 		}
		// 	}
		// 	$plans[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'animal' => $arr);
		// 	unset($arr);
		// }
		// return $this->render('plan', ['plans' => $plans]);
		// $plans = array();
		// $mpl = array();
		// foreach ($vetstation as $vet)
		// {
		// 	foreach ($viewplan as $plan)
		// 	{
		// 		if ($vet->ID == $plan->id_vet)
		// 		{
		// 			$mpl[] = array(
		// 					'animal' => $plan->animal,
		// 					'method' => array(
		// 						'title' => $plan->method,
		// 						'block' => $plan->block,
		// 						'block_plan' => $plan->block_plan,
		// 						'plan' => $plan->plan,
		// 					),
		// 				);
		// 		}
		// 	}
		// 	$plans[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'methodplan' => $mpl);
		// 	unset($mpl);
		// }
		// $data = json_encode($plans, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
		// return $this->render('plan', ['plans' => $plans]);
	}

	public function actionUpdate()
	{
		$cache = Yii::$app->cache;
		$data = $cache->get('vetreg');
		$animal = $cache->get('animal');
		$method = $cache->get('method');
		$planYear;
		if (Yii::$app->request->isGet)
		{
			$id = Yii::$app->request->get('id');
			// $methodplanyear = methodplanyear::find()->where(['ID' => $id])->all();
			// $methodplan = methodplan::find()->where(['ID_mpy' => $id])->all();
			//['methodplanyear'=> $methodplanyear, 'methodplan' => $methodplan]
			$query = gz_viewplan::find()->where(['id' => $id])->asArray()->all();
			$planYear = $query->plan;
			return $this->render('update', ['record' => $query, 'data' => $data, 'animal' => $animal, 'method' => $method]);
		}

		if (Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			//return $this->asJson($data);
			if($data['plan'] === $planYear)
			{
				$mp = gz_methodplan::findOne($data['id']);
				$mp->ID_block = $data['block'];
				$mp->block_plan = $data['block_plan'];
				$mp->save();
				return $this->redirect(['/assignment/edit']);
			}

			if($data['plan'] != $planYear)
			{
				$mp = gz_methodplan::findOne($data['id']);
				$mp->ID_block = $data['block'];
				$mp->block_plan = $data['block_plan'];
				$mp->save();
				$mpy = gz_methodplanyear::findOne($data['id_mpy']);
				$mpy->Plan = $data['plan'];
				$mpy->ID_vetstation = $data['vetstation'];
				$mpy->ID_animal = $data['animal'];
				$mpy->ID_method = $data['method'];
				$mpy->save();
				return $this->redirect(['/assignment/edit']);
			}
		}
	}

	public function actionDeletePlan()
	{
		if (Yii::$app->request->isGet)
		{
			$id = Yii::$app->request->get('id');
			$mp = gz_methodplan::find()->where(['id_mpy' => $id])->all();
			foreach ($mp as $met)
			{
				$met->delete();
			}
			$mpy = gz_methodplanyear::findOne($id);
			$mpy->delete();
			return $this->redirect(['/assignment/edit']);
		}
	}

	public function actionDeleteBlock()
	{
		if (Yii::$app->request->isGet)
		{
			$id = Yii::$app->request->get('id');
			$mp = gz_methodplan::findOne($id);
			$mp->delete();
			return $this->redirect(['/assignment/edit']);
		}
	}

	public function actionEdit()
	{
		// if (Yii::$app->request->isPost)
		// {
		// 	$data = Yii::$app->request->post();
		// 	$mp = methodplan::find()->where(['id' => $data['id']])->all();
		// 	$mp->ID_block = $data['block'];
		// 	$mp->block_plan = $data['block_plan'];
		// 	$mp->save();
		// 	return $this->asJson($mp);
		// }

		$viewplan = gz_viewplan1::find()->all();
		$vetstation = gz_vetstation::find()->all();
		$animals = gz_animal::find()->all();
		$blocks = array();
		$animalss = array();
		foreach ($vetstation as $vet)
		{
			foreach ($animals as $anim)
			{
				foreach ($viewplan as $plan)
				{
					if($vet->ID == $plan->id_vet && $anim->ID == $plan->id_animal)
					{
						$blocks[] = array(
							'method' => $plan->method,
							'block' => $plan->block,
							'block_plan' => $plan->block_plan,
							'plan' => $plan->plan,
							'id_mp' => $plan->id_mp,
							'id_mpy' => $plan->id_mpy,
						);
					}
				}
				$animalss[] = array('animal' => $anim->Title, 'blocks' => $blocks);
				unset($blocks);
			}
			$plans[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'animals' => $animalss);
			unset($animalss);
		}
		return $this->render('edit', ['plans' => $plans]);
		// $query = viewplan::find()->orderBy('id')->all();;
		// return $this->render('edit', ['records' => $query]);
	}

	public function actionGetEdit()
	{
		if(Yii::$app->request->isGet)
		{
			$viewplan = gz_viewplan1::find()->all();
			$vetstation = gz_vetstation::find()->all();
			$animals = gz_animal::find()->all();
			$blocks = array();
			$animalss = array();
			foreach ($vetstation as $vet)
			{
				foreach ($animals as $anim)
				{
					foreach ($viewplan as $plan)
					{
						if($vet->ID == $plan->id_vet && $anim->ID == $plan->id_animal)
						{
							$blocks[] = array(
								'method' => $plan->method,
								'block' => $plan->block,
								'block_plan' => $plan->block_plan,
								'plan' => $plan->plan,
								'id_mp' => $plan->id_mp,
								'id_mpy' => $plan->id_mpy,
							);
						}
					}
					$animalss[] = array('animal' => $anim->Title, 'blocks' => $blocks);
					unset($blocks);
				}
				$plans[] = array( 'id_vet' => $vet->ID, 'title' => $vet->Title, 'animals' => $animalss);
				unset($animalss);
			}
			return $this->asJson($plans);
		}
	}

	public function actionPlanCreate()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			// return $this->asJson(Yii::$app->request->post());
			$mpy = new gz_methodplanyear();
			$mpy->ID_vetstation = $data['vetstation'];
			$mpy->ID_animal = $data['animal'];
			$mpy->ID_method = $data['method'];
			$mpy->Plan = $data['amount'];
			$mpy->save();
			return $this->asJson($mpy->ID);
		}
		// $cache = Yii::$app->cache;
		// $an = $cache->get('animal');
		// $vet = $cache->get('vetreg');;
		// $method = $cache->get('method');
		// if ($an === false)
		// {
		// 	$animal = animal::find();
		// 	$animals = $animal->all();
		// 	$arr = array();
		// 	foreach ($animals as $ani) {
		// 		$arr[] = array(
		// 			'id_animal' => $ani->ID,
		// 			'title' => $ani->Title,
		// 		);
		// 	}
		// 	$an = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
		// 	$cache->set('animal', $an);
		// }
		// if ($vet === false)
		// {
			// $vetstation = vetstation::find();
			// $vets = $vetstation->all();
		// 	$arr = array();
		// 	foreach ($vets as $ani) {
		// 		$arr[] = array(
		// 			'id_vet' => $ani->ID,
		// 			'title' => $ani->Title,
		// 		);
		// 	}
		// 	$vet = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
		// 	$cache->set('vetstation', $vet);
		// }
		// if ($method === false)
		// {
		// 	$mp = method::find();
		// 	$mps = $mp->all();
		// 	$arr = array();
		// 	foreach ($mps as $ani) {
		// 		$arr[] = array(
		// 			'id_mp' => $ani->ID,
		// 			'title' => $ani->Title,
		// 		);
		// 	}
		// 	$method = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
		// 	$cache->set('vetstation', $method);
		// }
		// return $this->render('add', ['vet' => $vet, 'animal' => $an, 'method' => $method]);
		return $this->render('add');
	}

	public function actionPlanCreateBlock()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$amount = explode(',', $data['amount']);
			$i = 0;
			foreach ($data['id_block'] as $id)
			{
				$methodplan = new gz_methodplan();
				$methodplan->ID_block = $id;
				$methodplan->block_plan = $amount[$i];
				$methodplan->ID_mpy = $data['id_mpy'];
				$methodplan->save();
				$i++;
			}
			return $this->redirect(['/assignment/edit']);
		}
		// if(Yii::$app->request->isGet)
		// {
			$id = Yii::$app->request->get('id');
		// 	$block = Yii::$app->request->get('block');
		// 	$block_plan = Yii::$app->request->get('block_plan');
		// 	$methodplan = new methodplan();
		// 	$methodplan->ID_block = $block;
		// 	$methodplan->block_plan = $block_plan;
		// 	$methodplan->ID_mpy = $id;
		// 	if($methodplan->save())
		// 		return $this->asJson($methodplan);
		// }
		return $this->render('createblock');
	}


	public function actionPlanCreateBlock1()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$amount = explode(',', $data['amount']);
			$i = 0;
			foreach ($data['id_block'] as $id)
			{
				$methodplan = new gz_methodplan();
				$methodplan->ID_block = $id;
				$methodplan->block_plan = $amount[$i];
				$methodplan->ID_mpy = $data['id_mpy'];
				$methodplan->save();
				$i++;
			}
			return $this->redirect(['/assignment/edit']);
		}
			$id = Yii::$app->request->get('id');
		return $this->render('createblock', ['id_mpy' => $id]);
	}

	public function actionGetVet()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$vet = gz_vetstation::find()->all();
			foreach ($vet as $r) {
				$arr[] = array(
					'id' => $r->ID,
					'title' => $r->Title
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
		}
	}

	public function actionGetAnimal()
	{
		if(Yii::$app->request->isGet)
		{
			$arr = array();
			$vet = gz_animal::find()->all();
			foreach ($vet as $r) {
				$arr[] = array(
					'id' => $r->ID,
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
			$vet = gz_method::find()->all();
			foreach ($vet as $r) {
				$arr[] = array(
					'value' => $r->ID,
					'text' => $r->Title
				);
			}
			$arr = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
			return $arr;
		}
	}
}