<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class outgo extends ActiveRecord
{
	// public static function getDb()
	// {
	// 	return Yii::$app->get('db1');
	// }

	public static function tableName()
	{
		return 'reagent_outgo';
	}

	public static function findById($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function spendMaterial($data, $type)
	{
		$query = new outgo();
		$query->id_department = Yii::$app->user->identity['id_department'];//ИЗ МОДЕЛИ USER
		$query->id_arrival_material = $data['id'];
		$query->id_user = Yii::$app->user->identity['id'];//ИЗ МОДЕЛИ USER
		$query->amount = $data['amount'];
		$query->date_usage = $data['date_usage'];
		$query->date_record = $data['date_record'];
		$query->id_moving_type = $type;
		if($query->save())
			return $query;
	}

	public static function updateExpenses($data)
	{
		$error = static::findById($data['id_expenses']);
		$error->amount = $data['amount'];
		return $error->save();
	}
}