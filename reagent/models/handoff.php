<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class handoff extends ActiveRecord
{
	// public static function getDb()
	// {
	// 	return Yii::$app->get('db1');
	// }

	public static function tableName()
	{
		return 'reagent_handoff';
	}

	public static function findById($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function updateHandoff($id, $data)
	{
		$handoff = static::findById($id);
		$handoff->date_handoff = $data['date_handoff'];
		$handoff->id_handoff_status = $data['status'];
		if($handoff->save()) return $handoff;
	}
}