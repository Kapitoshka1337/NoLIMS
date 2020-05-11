<?php
namespace app\modules\equipment\models;
use Yii;
use yii\base\Model;
use yii\web\UploadedFile;

class UploadForm extends Model
{
    public $upload_file_name;

    public function rules()
    {
        return [
            [['upload_file_name'], 'file', 'skipOnEmpty' => false, 'extensions' => 'pdf'],
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
            $this->upload_file_name->saveAs($this->filename() . $this->upload_file_name->baseName. '.' . $this->upload_file_name->extension);
            return true;
        }
        else return false;
    }
}