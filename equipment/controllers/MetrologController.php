<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\view_metrolog_equipment;
use app\modules\equipment\models\equipment_type;
use app\modules\equipment\models\equipment_equipment;

class MetrologController extends Controller
{
	public $layout = 'main_metrolog';

	public function beforeAction($action)
	{
		if ($action->id == 'append')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionCertification()
	{
		return $this->render('certification');
	}

	public function actionVerification()
	{
		return $this->render('verification');
	}

	public function actionPlan()
	{
		return $this->render('plan');
	}

	public function actionFgis()
	{
		return $this->render('fgis');
	}

	public function actionEquipments()
	{
		//номер номер_отдела вид наименование S/N фиф дата_проверки дата_след_проверки
		return $this->render('equipment');
	}

	public function actionDetails()
	{
		//номер номер_отдела вид наименование S/N фиф дата_проверки дата_след_проверки
		return $this->render('details', ['id' => Yii::$app->request->get('id')]);
	}

	public function actionGetEquipments()
	{
		$equipments = view_metrolog_equipment::find()->all();
		return $this->asJson($equipments);
	}

	public function actionGetType()
	{
		$type = equipment_type::find()->all();
		return $this->asJson($type);
	}

	public function actionAppend()
	{
		if(Yii::$app->request->isPost)
		{
			// return $this->asJson(Yii::$app->request->post());
			$data = Yii::$app->request->post();
			$equipment = new equipment_equipment();
			$equipment->id_department = $data['id_department'];
			$equipment->id_equipment_type = $data['id_equipment_type'];
			$equipment->purpose_of_use = $data['purpose_of_use'];
			$equipment->number = $data['number'];
			$equipment->title = $data['title'];
			$equipment->model = $data['model'];
			$equipment->serial_number = $data['serial_number'];
			$equipment->manufacturer = $data['manufacturer'];
			$equipment->date_create = $data['date_create'];
			$equipment->inventory_number = $data['inventory_number'];
			$equipment->id_location = $data['id_location'];
			if($equipment->save())
				return $this->asJson($equipment);
		}
	}
}