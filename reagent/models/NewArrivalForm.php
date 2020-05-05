<?php
namespace app\modules\reagent\models;
use Yii;
use yii\base\Model;

class NewArrivalForm extends Model
{

    public $num_invoice;
    public $date_invoice;
    public $id_storage;
    public $id_type;
    public $id_material;
    public $id_measure;
    public $amount;
    public $shelf_life;
    public $date_create;

    public function rules()
    {
        return [
            [['num_invoice', 'date_invoice'], 'required', 'message' => 'Необходимо заполнить']
        ];
    }
}