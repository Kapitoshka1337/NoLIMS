<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class view_equipment_kits extends ActiveRecord
{
	public static function tableName()
	{
		return 'equipment_kits';
	}
}