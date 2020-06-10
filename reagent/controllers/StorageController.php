<?php

namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\view_storage_index;
use app\modules\reagent\models\arrival_material;
use app\modules\reagent\models\outgo;
use app\modules\reagent\models\passport;
use app\modules\reagent\models\UploadForm;
use yii\web\UploadedFile;

class StorageController extends Controller
{
	public $layout = 'main_other';
	
	public function beforeAction($action)
	{
		if ($action->id == 'upload-file')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

    public function actionIndex()
    {
    	//$this->layout = 'main_other';
        return $this->render('index');
    }

	public function actionGetStorage()
	{
		if(Yii::$app->request->isGet)
		{
			if(Yii::$app->request->get('all') == 0)
			{
				$passport = passport::find()->all();
				$storage = view_storage_index::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
				return $this->asJson($storage);
			}
			else if(Yii::$app->request->get('all') == 1)
			{
				$storage = view_storage_index::find()->all();
				return $this->asJson($storage);
			}
		}
	}

	public function actionMaterialToArchive()
	{
		$archive = arrival_material::moveToArchive(Yii::$app->request->get('id'));
		if($archive) return $this->asJson($archive);
	}

	public function actionExpenseMaterial()
	{
		if(Yii::$app->request->isGet)
		{
			// $query = outgo::find()->where(['arrival_material_id' => Yii::$app->request->get('id')])->one();
			// if($query)
			// {
			$query = new outgo();
				$query->id_department = Yii::$app->user->identity['id_department'];
				$query->id_arrival_material = Yii::$app->request->get('id');
				$query->id_user = Yii::$app->user->identity['id'];
				$query->amount = Yii::$app->request->get('amount');
				$query->date_usage = Yii::$app->request->get('date_usage');
				$query->date_record = Yii::$app->request->get('date_record');
				$query->id_moving_type = 2;
				if($query->save())
					return $this->asJson($query);
			// }
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
				$passport = passport::uploadFile(Yii::$app->request->post('id_arrival_material'), $model->File->baseName . '.' . $model->File->extension, Yii::$app->request->post('id_type_upload_files'));
				if($passport)
				{
					$arrivalMaterial = arrival_material::updateFileName(Yii::$app->request->post('id_arrival_material'), $passport->id);
					if($arrivalMaterial)
						return Yii::$app->response->statusCode = 200;
				}
			}
			else return Yii::$app->response->statusCode = 400;
		}
	}

	public function actionGetPassport()
	{
		$id_passport = arrival_material::returnPassportId(Yii::$app->request->get('id'));
		$passport = passport::findById($id_passport->id_passport);
		$filePath = '/frontend/web/assets/uploads/';
		return $this->asJson($filePath . $passport->filename);
		// $completePath = Yii::getAlias('@web'.$filePath . $passport->filename);
		// return Yii::$app->response->sendFile($completePath, $passport->filename);
	}
}
