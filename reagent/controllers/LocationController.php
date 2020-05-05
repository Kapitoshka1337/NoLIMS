<?php
namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\location;

class LocationController extends Controller
{
	public $layout = 'main_other';
	
	public function beforeAction($action)
	{
		if ($action->id == 'create-location' || $action->id == 'edit-location')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionGetLocation()
	{
		$location = location::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
		return $this->asJson($location);
	}

	public function actionCreateLocation()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$location = new location();
			$location->id_department = Yii::$app->user->identity['id_department'];//USER MODEL
			$location->cabinet_number = $data['cabinet_number'];
			$location->place = $data['place'];
			$location->notation = $data['notation'];
			if($location->save())
				return $this->asJson($location);
		}
	}

	public function actionEditLocation()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$query = location::find()->where(['id' => $data['id']])->one();
			if($query)
			{
				$query->cabinet_number = $data['cabinet_number'];
				$query->place = $data['place'];
				$query->notation = $data['notation'];
				if($query->save())
					return $this->asJson($query);
			}
		}
	}

	public function actionDeleteLocation()
	{
		if(Yii::$app->request->isGet)
		{
			$query = location::find()->where(['id' => Yii::$app->request->get('id')])->one();
			$query->delete();
			return $this->asJson($query);
		}
	}
}