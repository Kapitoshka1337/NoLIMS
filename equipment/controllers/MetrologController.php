<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\department;
use app\modules\equipment\models\view_metrolog_equipment;
use app\modules\equipment\models\equipment_type;
use app\modules\equipment\models\equipment_equipment;
use app\modules\equipment\models\equipment_upload_document_type;
use app\modules\equipment\models\equipment_equipment_details;
use app\modules\equipment\models\equipment_date_check;
use app\modules\equipment\models\UploadForm;
use yii\web\UploadedFile;

class MetrologController extends Controller
{
	public $layout = 'main_metrolog';

	public function beforeAction($action)
	{
		if ($action->id == 'append-equipment' || $action->id == 'upload-file')
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
		return $this->render('equipment');
	}

	public function actionDetails()
	{
		$eq = equipment_equipment_details::find()->where(['id' => Yii::$app->request->get('id')])->one();
		return $this->render('details', ['id' => Yii::$app->request->get('id'), 'eq' => $eq]);
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

	public function actionGetDocType()
	{
		$type = equipment_upload_document_type::find()->all();
		return $this->asJson($type);
	}

	public function actionAppendEquipment()
	{
		if(Yii::$app->request->isPost)
		{
			// return $this->asJson(Yii::$app->request->post());
			$data = Yii::$app->request->post();
			$array = array();
			foreach ($data as $eq)
			{
				$equipment = new equipment_equipment();
				$equipment->id_department = $eq['id_department'];
				$equipment->id_equipment_type = $eq['id_equipment_type'];
				$equipment->number = $eq['number'];
				$equipment->title = $eq['title'];
				$equipment->model = $eq['model'];
				$equipment->serial_number = $eq['serial_number'];
				$equipment->manufacturer = $eq['manufacturer'];
				$equipment->date_create = $eq['date_create'];
				$equipment->inventory_number = $eq['inventory_number'];
				$equipment->id_location = $eq['id_location'];
				if($equipment->save()) array_push($array, $equipment);
			}
			return $this->asJson($array);
		}
		return $this->render('append');
	}

	public function actionGetDepartment()
	{
		if(Yii::$app->request->isGet)
		{
			$departments = department::find()->all();
			$locations = location::find()->all();
			$arr = array();
			$location = array();

			foreach ($departments as $dep)
			{
				foreach ($locations as $loc)
				{
					if($dep->id == $loc->id_department)
					{
						$location[] = array(
							'id' => $loc->id,
							'cabinet_number' => $loc->cabinet_number,
							'place' => $loc->place,
							'notation' => $loc->notation
						);
					}
				}
				$arr[] = array('id_department' => $dep->id, 'department' => $dep->title, 'locations' => $location);
				unset($location);
			}
			return $this->asJson($arr);
		}
	}

	public function actionUploadFile()
	{
		$model = new UploadForm();
		if(Yii::$app->request->isPost)
		{
			$model->File = UploadedFile::getInstanceByName('File');
			if ($model->upload())
			{
				$check = equipment_date_check::uploadFile(Yii::$app->request->post('id_equipment'), $model->File->baseName . '.' . $model->File->extension, Yii::$app->request->post('id_type_upload_files'));
				if($check)
				{
					// $arrivalMaterial = arrival_material::updateFileName(Yii::$app->request->post('id_arrival_material'), $check->id);
					// if($arrivalMaterial)
						return Yii::$app->response->statusCode = 200;
				}
			}
			else return Yii::$app->response->statusCode = 400;
		}
	}
}