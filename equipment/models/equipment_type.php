<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class equipment_type extends ActiveRecord
{
	public static function tableName()
	{
		return 'equipment_type';
	}
}