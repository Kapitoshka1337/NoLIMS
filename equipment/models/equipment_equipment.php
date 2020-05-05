<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class equipment_equipment extends ActiveRecord
{
	public static function tableName()
	{
		return 'equipment_equipment';
	}
}