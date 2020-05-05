<?php
namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\errors;
use app\modules\reagent\models\view_errors_index;
use app\modules\reagent\models\outgo;

class ErrorsController extends Controller
{
	public function beforeAction($action)
	{
		if ($action->id == 'submit-error' || $action->id == 'approve-error' || $action->id == 'declining-error')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

    public function actionError()
    {
        return $this->render('index');
    }

    public function actionSubmitError()
    {
    	if(Yii::$app->request->isPost)
    	{
    		$error = errors::submitError(Yii::$app->request->post());
    		return $this->asJson($error);
    	}
    }

    public function actionGetError()
    {
		$errors = view_errors_index::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
		return $this->asJson($errors);
    }

    public function actionApproveError()
    {
    	if(Yii::$app->request->isPost)
    	{
    		$error = errors::updateError(Yii::$app->request->post(), 2);
    		if($error)
    		{
    			$outgo = outgo::updateExpenses(Yii::$app->request->post());
    			return $this->asJson($outgo);
    		}
    	}
    }

    public function actionDecliningError()
    {
    	if(Yii::$app->request->isPost)
    	{
    		$error = errors::updateError(Yii::$app->request->post(), 3);
    		return $this->asJson($error);
    	}
    }
}