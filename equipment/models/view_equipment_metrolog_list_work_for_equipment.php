<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class view_equipment_metrolog_list_work_for_equipment extends ActiveRecord
{
	public static function tableName()
	{
		return 'equipment_metrolog_list_work_for_equipment';
	}
}