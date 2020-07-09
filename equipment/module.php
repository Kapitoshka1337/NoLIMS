<?php
namespace app\modules\equipment;
use Yii;
use yii\filters\AccessControl;

class module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\equipment\controllers';

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'actions' => [
                            'logout',
                            //INDEX
                            'index',
                            'details',
                            'get-today',
                            //EQUIPMENTS
                            'equipments',
                            'get-equipments',
                            'get-department',
                            'get-doc-type',
                            'append-equipment',
                            'change-check',
                            'upload-file',
                            //EDIT
                            'edit',
                            'get-details',
                            'get-object-study',
                            'get-maintenance',
                            'save-equipment',
                            'get-instructions',
                            'save-instructions',
                            //APPEND
                            'append-maintenance',
                            'get-type',
                            //
                            'save-check',
                            'save-maintenances',
                            //
                            'print-sticker',
                            'print-card',
                            'print-table',
                            'print-protocol',
                            'set-tag',
                            'set-handoff',
                            'send-request',
                            //VERIFICATION
                            'verification',
                            'get-verification',
                            'submit-verification',
                            'recieved-eq-before',
                            'recieved-eq-after',
                            'print-csm',
                            //REPAIR
                            'repair',
                            'get-repair',
                            'approve-repair',
                            'declining-repair',
                            'finish-repair',
                            'append-repair',
                            'plan'
                        ],
                        'matchCallback' => function ($rule, $action) {
                            return Yii::$app->user->identity['role'] === 'corporal-five';
                        }
                    ],
                ],
            ],
        ];
    }

    public function init()
    {
        parent::init();
    }
}