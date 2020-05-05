<?php

namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class arrival_material extends ActiveRecord
{
	// public static function getDb()
	// {
	// 	return Yii::$app->get('db1');
	// }

	public static function tableName()
	{
		return 'reagent_arrival_material';
	}

	public static function findById($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function returnPassportId($id)
	{
		return static::findOne(['id' => $id]);
	}

	public static function createArrivalMaterials($arrival_id, $data)
	{
		$array = array();
		foreach ($data as $material)
		{
			$arrival_material = new arrival_material();
			$arrival_material->id_arrival = $arrival_id;
			$arrival_material->id_material = $material['material_id'];
			$arrival_material->amount = $material['amount'];
			$arrival_material->packing_name = $material['packing_name'];
			$arrival_material->id_location = $material['id_location'];
			$arrival_material->shelf_life = date_format(date_create($material['shelf_life']), 'Y-m-d');
			$arrival_material->date_create = date_format(date_create($material['date_create']), 'Y-m-d');
			$arrival_material->id_passport = $material['id_passport'];
			if($arrival_material->save()) array_push($array, $arrival_material);
		}
		return $array;
	}

	public static function updateFileName($id, $passport)
	{
		$filename = static::findById($id);
		$filename->id_passport = $passport;
		if($filename->save()) return $filename;
	}

	public static function moveToArchive($id)
	{
		$archive = static::findById($id);
		$archive->archive = true;
		if($archive->save()) return $archive;
	}
}