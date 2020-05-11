<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class equipment_date_check extends ActiveRecord
{
	public static function findByEqId($id)
	{
		return static::findOne(['id_equipment' => $id]);
	}
	
	// public static function uploadFile($id, $name)
	// {
	// 	$file = equipment_date_check::findByEqId($id);
	// 	// $file->id_upload_document_type = $type;
	// 	$file->upload_file_name = $name;
	// 	if($file->save()) return $file;
	// }
}