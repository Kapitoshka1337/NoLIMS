<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class passport extends ActiveRecord
{
	public static function tableName()
	{
		return 'reagent_passport';
	}

	public static function findById($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function uploadFile($id, $name, $type)
	{
		$passport = new passport();
		$passport->id_arrival_material = $id;
		$passport->id_type_upload_files = $type;
		$passport->filename = $name;
		if($passport->save()) return $passport;
	}
}