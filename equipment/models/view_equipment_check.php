<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class view_equipment_check extends ActiveRecord
{
	public static function tableName()
	{
		return 'equipment_check';
	}
}