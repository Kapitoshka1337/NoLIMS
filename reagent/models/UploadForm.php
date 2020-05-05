<?php
namespace app\modules\reagent\models;
use Yii;
use yii\base\Model;
use yii\web\UploadedFile;

class UploadForm extends Model
{
    public $File;

    public function rules()
    {
        return [
            [['File'], 'file', 'skipOnEmpty' => false, 'extensions' => 'pdf'],
        ];
    }

    public function filename()
    {
        return Yii::$app->basePath . '/web/assets/uploads/';
    }

    public function upload()
    {
        if ($this->validate())
        {
            // $filename = $this->File->name = '1' . '.' . $this->File->extension;
            $this->File->saveAs($this->filename() . $this->File->baseName. '.' . $this->File->extension);
            return true;
        }
        else return false;
    }
}