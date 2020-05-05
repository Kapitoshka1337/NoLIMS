<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class arrivals extends ActiveRecord
{
	// public static function getDb()
	// {
	// 	return Yii::$app->get('db1');
	// }

	public static function tableName()
	{
		return 'reagent_arrivals';
	}

	public static function createArrival($data, $type)
	{
		$arrival = new arrivals();
		$arrival->num_order = $data['num_order'];
		$arrival->date_order = $data['date_order'];
		$arrival->id_department = $data['department'];
		$arrival->id_moving_type = $type;
		if($arrival->save()) return $arrival;
	}

	public static function createArrival1($data, $type)
	{
		$arrival = new arrivals();
		$arrival->num_order = $data['num_order'];
		$arrival->date_order = $data['date_order'];
		$arrival->id_department = Yii::$app->user->identity['id_department'];
		$arrival->id_moving_type = $type;
		if($arrival->save()) return $arrival;
	}
}