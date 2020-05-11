<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\department;
use app\modules\equipment\models\view_metrolog_equipment;
use app\modules\equipment\models\view_equipment_metrolog_sticker;
use app\modules\equipment\models\equipment_type;
use app\modules\equipment\models\equipment_equipment;
use app\modules\equipment\models\equipment_upload_document_type;
use app\modules\equipment\models\equipment_equipment_details;
use app\modules\equipment\models\equipment_date_check;
use app\modules\equipment\models\UploadForm;
use yii\web\UploadedFile;
use Dompdf\Dompdf;
use Dompdf\Options;

class MetrologController extends Controller
{
	public $layout = 'main_metrolog';

	public function beforeAction($action)
	{
		if ($action->id == 'append-equipment' || $action->id == 'upload-file' || $action->id == 'change-check' || $action->id == 'create-sticker')
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

	public function actionChangeCheck()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$model = new UploadForm();
			$eq = equipment_date_check::findByEqId($data['id_equipment']);
			if($model->upload_file_name = UploadedFile::getInstanceByName('upload_file_name'))
			{
				if($eq)
				{
					$eq->date_current_check = $data['date_current_check'];
					$eq->date_next_check = $data['date_next_check'];
					$eq->id_upload_document_type = $data['id_upload_document_type'];
					$eq->number_document = $data['number_document'];
					$eq->upload_file_name = $model->upload_file_name->baseName . '.' . $model->upload_file_name->extension;
					if($eq->save())
						if ($model->upload()) return Yii::$app->response->statusCode = 200;
						else return Yii::$app->response->statusCode = 400;
				}
				else
				{
					$eq = new equipment_date_check();
					$eq->id_equipment= $data['id_equipment'];
					$eq->date_current_check = $data['date_current_check'];
					$eq->date_next_check = $data['date_next_check'];
					$eq->id_upload_document_type = $data['id_upload_document_type'];
					$eq->number_document = $data['number_document'];
					$eq->upload_file_name = $model->upload_file_name->baseName . '.' . $model->upload_file_name->extension;
					if($eq->save())
						if ($model->upload()) return Yii::$app->response->statusCode = 200;
						else return Yii::$app->response->statusCode = 400;
				}
			}
			else return Yii::$app->response->statusCode = 200;
		}
	}

	public function actionUploadFile()
	{
		//ВМЕСТО UPLOADFILE
		// if(Yii::$app->request->isPost)
		// {
		// 	// return $this->asJson(Yii::$app->request->post());
		// 	$data = Yii::$app->request->post();
		// 	$eq = equipment_date_check::findByEqId($data['id_equipment']);
		// 	if($eq)
		// 	{
		// 		$eq->date_current_check = $data['date_current_check'];
		// 		$eq->date_next_check = $data['date_next_check'];
		// 		$eq->id_upload_document_type = $data['id_upload_document_type'];
		// 		$eq->number_document = $data['number_document'];
		// 		if($eq->save()) return Yii::$app->response->statusCode = 200;
		// 		else Yii::$app->response->statusCode = 400;
		// 	}
		// 	else
		// 	{
		// 		$eq = new equipment_date_check();
		// 		$eq->id_equipment= $data['id_equipment'];
		// 		$eq->date_current_check = $data['date_current_check'];
		// 		$eq->date_next_check = $data['date_next_check'];
		// 		$eq->id_upload_document_type = $data['id_upload_document_type'];
		// 		$eq->number_document = $data['number_document'];
		// 		if($eq->save()) return Yii::$app->response->statusCode = 200;
		// 		else Yii::$app->response->statusCode = 400;			
		// 	}
		// }
	}

	public function actionCreateSticker()
	{
		// $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('assets/template/Temp.docx');
		// $templateProcessor->setValue('weekday', date('l'));
		// $templateProcessor->setValue('time', date('H:i'));
		// $templateProcessor->setValue('serverName', realpath(__DIR__));
		// $templateProcessor->saveAs('Sample_09_TemplateCloneRow.docx');
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$stickers = array_chunk(view_equipment_metrolog_sticker::findAll(['id_equipment' => $data]), 5);
			$ht = '
			<body>
			<div class="sixteen wide column">
				<table class="ui four column celled table" style="font-size: 7px;">
					<tbody>';
					foreach ($stickers as $sticker)
					{
						$ht .= '<tr>';
						foreach ($sticker as $stick)
						{
							switch ($stick->type)
							{
								case 'ВО':
									$type = 'проверки';
									break;
								case 'ИО':
									$type = 'аттестации';
									break;
								case 'СИ':
									$type = 'поверки';
									break;
							}
							$ht .= '
								<td>
									<div class="label">Отдел: <u>'. $stick->department .'</u></div>
									<div class="label">Наименовение, тип: <br><u>' .$stick->equipment . ' ' .($stick->type) . '</u></div>';
									if($type === 'поверки')
										$ht .= '<div class="label">Рег.карта: <u>'.$stick->department .'</u> <span class="label">ФИФ: <u>'. $stick->fif_number .'</u></span></div>';
										// $ht .= '<div class="label">ФИФ: <u>'. $stick->fif_number .'</u></div>';
									else
										$ht .= '<div class="label">Рег.карта: <u>'.$stick->department .'</u></div>';

									$ht .= '<div class="label">Заводской номер: <u>'. $stick->serial_number .'</u></div>
									<div class="label">Инветарный номер: <u>'. $stick->inventory_number .'</u></div>
									<div class="label">Дата <u>'. $type .'</u>: <u>'. $stick->date_current_check .'</u></div>
									<div class="label">Дата следующей: <u>'.$stick->date_next_check .'</u></div>
								</td>';
						}
						$ht .= '</tr>';
					}
						$ht .='
					</tbody>
				</table>
				</div>
			</body>';
			include_once 'D:/OSPanel/vendor/autoload.php';
			$mpdf = new \Mpdf\Mpdf();
			$mpdf->SetDisplayMode('fullpage');
			$mpdf->AddPage('P','','','','',3,3,3,0,0,0);
			$stylesheet = file_get_contents('D:/OSPanel/domains/nolims/frontend/web/assets/vendor/semantic/semantic.css');
			$mpdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);
			$mpdf->WriteHTML($ht, \Mpdf\HTMLParserMode::HTML_BODY);
			$mpdf->Output('assets/template/sticker.pdf', \Mpdf\Output\Destination::FILE);
			return $this->asJson('/assets/template/sticker.pdf');
			// Yii::$app->response->format = \yii\web\Response::FORMAT_RAW;
			// Yii::$app->response->headers->add('Content-Type', 'application/pdf');
			// return $this->render('tcpdf');
		}
	}
}