    <div id="addForm" class="eight wide column">
        <div class="ui fluid card">
            <div class="content">
                <?php $form = ActiveForm::begin() ?>
                    <?= $form->field($model,'num_invoice') ?>
                    <?= $form->field($model,'date_invoice') ?>
                    <?= $form->field($model,'id_storage') ?>
                    <?= $form->field($model,'id_type') ?>
                    <?= $form->field($model,'id_material') ?>
                    <?= $form->field($model,'id_measure') ?>
                    <?= $form->field($model,'amount') ?>
                    <?= $form->field($model,'shelf_life') ?>
                    <?= $form->field($model,'date_create') ?>
                    <div class="ui attached buttons">
                        <?= Html::submitButton('Добавить', ['class' => 'ui green button']) ?>
                    </div>
                <?php $form = ActiveForm::end() ?>
            </div>
        </div>
    </div>