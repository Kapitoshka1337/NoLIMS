<?php
namespace app\modules\equipment\models;
use Yii;
use yii\db\ActiveRecord;

class location extends ActiveRecord
{
	public static function tableName()
	{
		return 'reagent_location';
	}
}