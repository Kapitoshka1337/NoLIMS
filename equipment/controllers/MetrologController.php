<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\department;
use app\modules\equipment\models\view_metrolog_equipment;
use app\modules\equipment\models\view_equipment_metrolog_sticker;
use app\modules\equipment\models\view_equipment_metrolog_card;
use app\modules\equipment\models\view_equipment_metrolog_list_work_for_equipment;
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
		if ($action->id == 'append-equipment' || $action->id == 'upload-file' || $action->id == 'change-check'
			|| $action->id == 'create-sticker' || $action->id == 'set-tag' || $action->id == 'set-handoff' || $action->id == 'create-card')
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
			$data = Yii::$app->request->post();
			$equipment = new equipment_equipment();
			$equipment->id_department = $data['id_department'];
			$equipment->id_equipment_type = $data['id_equipment_type'];
			$equipment->number = $data['number'];
			$equipment->title = $data['title'];
			$equipment->model = $data['model'];
			$equipment->serial_number = $data['serial_number'];
			$equipment->manufacturer = $data['manufacturer'];
			$equipment->date_create = $data['date_create'];
			$equipment->inventory_number = $data['inventory_number'];
			$equipment->id_location = $data['id_location'];
			if($equipment->save()) return $this->asJson($equipment);
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
			$stickers = array_chunk(view_equipment_metrolog_sticker::findAll(['id_equipment' => $data]), 4);
			$ht = '<head><style>table, th, td { padding: 10px; border: 1px solid black; border-collapse: collapse; padding: 6px; margin: 0px; font-size: 12px;} b{font-weight: bold;}</style></head><body><div><table><tbody>';
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
								<td style="width: 288px">
									<div class="label"><b>Отдел:</b> <u>'. $stick->department .'</u></div>
									<div class="label"><b>Наименовение, тип:</b> <br><u>' .$stick->equipment . ' ' .($stick->type) . '</u></div>';
									if($type === 'поверки')
										$ht .= '<div class="label"><b>Рег.карта:</b> <u>'.$stick->number . '/' . $stick->id_department . '-' . $stick->type .'</u> <span class="label"><b>ФИФ:</b> <u>'. $stick->fif_number .'</u></span></div>';
										// $ht .= '<div class="label">ФИФ: <u>'. $stick->fif_number .'</u></div>';
									else
										$ht .= '<div class="label"><b>Рег.карта: </b><u>'.$stick->number . '/' . $stick->id_department . '-' . $stick->type .'</u></div>';
									$ht .= '<div class="label"><b>Заводской номер: </b><u>'. $stick->serial_number .'</u></div>
									<div class="label"><b>Инветарный номер: </b><u>'. $stick->inventory_number .'</u></div>
									<div class="label"><b>Дата <u>'. $type .'</u>:</b> <u>'. $stick->date_current_check .'</u></div>
									<div class="label"><b>Дата следующей: </b><u>'.$stick->date_next_check .'</u></div>
								</td>';
						}
						$ht .= '</tr>';
					}
						$ht .='</tbody></table></div></body>';
			include_once 'D:/OpenServer/OSPanel/vendor/autoload.php';
			$mpdf = new \Mpdf\Mpdf();
			$mpdf->SetDisplayMode('fullpage');
			$mpdf->AddPage('P','','','','',3,3,3,0,0,0);
			// $stylesheet = file_get_contents('D:/OpenServer/OSPanel/domains/nolims/frontend/web/assets/vendor/semantic/semantic.css');
			// $mpdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);
			$mpdf->WriteHTML($ht);
			$mpdf->Output('assets/template/sticker.pdf', \Mpdf\Output\Destination::FILE);
			return $this->asJson('/assets/template/sticker.pdf');
			// Yii::$app->response->format = \yii\web\Response::FORMAT_RAW;
			// Yii::$app->response->headers->add('Content-Type', 'application/pdf');
			// return $this->render('tcpdf');
		}
	}

	public function actionCreateCard()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$tmp_card = view_equipment_metrolog_card::findAll(['id_equipment' => $data]);
			$maintenance = view_equipment_metrolog_list_work_for_equipment::findAll(['id_equipment' => $data]);
			//ВО ИО протокол СИ свидетельство
			foreach ($tmp_card as $card)
			{
				if($card['type'] === 'ВО' || $card['type'] === 'ИО') $type = 'Протокол №'; else $type = 'Свид-во №';
				$ht = '<head>
					<style>
						* {
							font-size: 14px;
						}
						table, th, td { 
							padding: 10px;
							border: 1px solid black;
							border-collapse: collapse;
							padding: 6px;
							margin: 0px;
						}
						b {
							font-weight: bold;
						}
						.center {
							text-align: center;
						}
						.header {
							font-size: 22px;
						}
					</style>
				</head>
				<body>
						<table>
						<tbody>
							<tr>
								<td class="center">ДФ.04.31.2017</td>
								<td colspan="7" class="center">
									<div>Бюджетное учреждение Удмуртской Республики "Удмуртский ветеринарно-диагностический центр"</div>
									<div>СИСТЕМА МЕНЕДЖМЕНТА КАЧЕСТВА ИЦ</div>
									<div>Документированная форма</div>
									<div><b>Регистрационная карточка оборудования</b></div>
								</td>
								<td class="center">лицевая сторона регистрационной карточки</td>
							</tr>
							<tr>
								<td colspan="9"></td>
							</tr>
							<tr>
								<td colspan="8" class="center"><b class="header">Регистрационная карточка оборудования '. $card['type'] .'</b></td>
								<td>кабинет '. $card['cabinet_number'] .'</td>
							</tr>
							<tr>
								<td class="center" rowspan="2"><b>Регистрационный №</b></td>
								<td class="center" rowspan="2"><b>Наименование определяемых (измеряемых) характеристик (параметров), функциональное назначение</b></td>
								<td class="center" rowspan="2"><b>Наименование оборудования,  тип (марка)</b></td>
								<td class="center" rowspan="2"><b>Зав.№</b></td>
								<td class="center" rowspan="2"><b>Изготовитель (страна, город,  наименование организации)</b></td>
								<td class="center" rowspan="2"><b>Год выпуска/ ввода в эксплуатацию</b></td>
								<td class="center" rowspan="2"><b>Инвентарный №</b></td>
								<td class="center" colspan="2"><b>Метрологические характеристики</b></td>
							</tr>
							<tr>
								<td class="center"><b>Диапазон измерений</b></td>
								<td class="center"><b>Погрешность измерений</b></td>
							</tr>
							<tr>
								<td>Отдел</td>
								<td colspan="8">'. $card['department'] .'</td>
							</tr>
							<tr>
								<td class="center">'. $card['number'] . '/' . $card['id_department'] . '-' . $card['type'] .'</td>
								<td class="center">'. $card['function_of_use'] .'</td>
								<td class="center">'. $card['equipment'] .'</td>
								<td class="center">'. $card['serial_number'] .'</td>
								<td class="center">'. $card['manufacturer'] .'</td>
								<td class="center">'. $card['date_create'] .'</td>
								<td class="center">'. $card['inventory_number'] .'</td>
								<td class="center">'. $card['measuring_range'] .'</td>
								<td class="center">'. $card['class_accuracy'] .'</td>
							</tr>
							<tr>
								<td colspan="9">
									Эксплуатационный документ: рп, св-во <br>
									Состояние на момент приёмки: соотв <br>
									<b>Данные о поверках:</b> периодичность 1 раз в год
								</td>
							</tr>
							<tr>
								<td colspan="3"> '. $type .' СП 28828282 от 20.02.2020</td>
							</tr>
							<tr>
								<td colspan="1"><b>Вид ТО</b></td>
								<td class="center" colspan="1">Сроки выполнения</td>
								<td class="center" colspan="6">Проводимые работы</td>
								<td class="center" colspan="1">Ответственный</td>
							</tr>';
							if($maintenance != null)
								foreach ($maintenance as $main)
								{
									if ($card['id_equipment'] == $main['id_equipment'])
										$ht .= '<tr>
									<td class="center">'. $main['maintenance'] .'</td>
									<td class="center">'. $main['periodicity'] .'</td>
									<td class="center" colspan="6">'. $main['description'] .'</td>
									<td class="center">'. $main['executor'] .'</td>
									</tr>';
								}
							else
								$ht .= '<tr><td class="center" colspan="9">Техническое обслуживание не требуется</td></tr>';

							$ht .='
							<tr>
								<td colspan="9"><b>Данные о ремонте и ТО:</b></td>
							</tr>
							<tr>
								<td class="center" colspan="1">Номер п/п</td>
								<td class="center" colspan="1">Дата</td>
								<td class="center" colspan="3">Характер неисправности и вид производимой работы</td>
								<td colspan="4" class="center">Наименование организации, Ф.И.О.,<br>должность выполнившего работу<br>(подпись внесшего запись с расшифровкой Ф.И.О.)</td>
							</tr>
						</tbody>
					</table>
				</body>';
			}
			include_once 'D:/OpenServer/OSPanel/vendor/autoload.php';
			$mpdf = new \Mpdf\Mpdf();
			$mpdf->SetDisplayMode('fullpage');
			$mpdf->AddPage('L','','','','',3,3,3,0,0,0);
			$mpdf->WriteHTML($ht);
			$mpdf->Output('assets/template/card.pdf', \Mpdf\Output\Destination::FILE);
			return $this->asJson('/assets/template/card.pdf');	
		}
	}

	public function actionSetTag()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$eq = view_metrolog_equipment::updateAll([$data['tag'] => 1], ['id' => $data['eq']]);
			if($eq)
				return Yii::$app->response->statusCode = 200;
		}
	}

	public function actionSetHandoff()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$eq = equipment_equipment::updateAll(['id_department' => $data['id_department_to']], ['id' => $data['id_equipment']]);
			if($eq)
				return Yii::$app->response->statusCode = 200;
		}
	}
}