<?php
namespace app\modules\reagent\models;
use Yii;
use yii\db\ActiveRecord;

class type extends ActiveRecord
{
    // public static function getDb()
    // {
    //     return Yii::$app->get('db1');
    // }
	public static function tableName()
	{
		return 'reagent_type';
	}
}