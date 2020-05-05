<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class errors extends ActiveRecord
{
	// public static function getDb()
	// {
	//     return Yii::$app->get('db1');
	// }
	public static function tableName()
	{
		return 'reagent_errors';
	}

	public static function findById($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function submitError($data)
	{
		$error = new errors();
		$error->id_outgo = $data['id_expenses'];
		$error->id_user = Yii::$app->user->identity['id'];//ИЗ МОДЕЛИ USER
		$error->id_department = Yii::$app->user->identity['id_department'];//ИЗ МОДЕЛИ USER
		$error->amount = $data['amount'];
		$error->description = $data['description'];
		$error->date_record = $data['date_record'];
		$error->amount_expenses = $data['amount_expenses'];
		$date = date_create($data['date_usage']);
		$error->date_usage = date_format($date, 'Y-m-d');
		$error->id_handoff_status = 1;
		$error->id_material = $data['id_material'];
		$error->material = $data['material'];
		return $error->save();
	}

	public static function updateError($data, $status)
	{
		$error = static::findById($data['id_error']);
		$error->id_handoff_status = $status;
		return $error->save();
	}
}