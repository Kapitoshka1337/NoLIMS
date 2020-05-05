<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/js/assignment/edit.js');
?>
<div class="sixteen wide column" id="getInfo3">
	<div class="ui menu table-head">
        <div class="left menu">
            <div class="item">
                <div class="ui small icon input">
                    <input type="text" placeholder="Поиск...">
                    <i class="search icon"></i>
                </div>
            </div>
        </div>
        <div class="right menu">
            <a href="<?php echo Url::toRoute(['/farm']) ?>" class="item">Предприятия</a>
            <a href="<?php echo Url::toRoute(['/method']) ?>" class="item">Исследования</a>
            <a href="<?php echo Url::toRoute(['/animal']) ?>" class="item">Животные</a>
            <a href="<?php echo Url::toRoute(['/plan-create']) ?>" class="item">Добавить план</a>
        </div>
    </div>
    <table class="ui table" id="detailPlan">
        <tbody class="ui accordion">
        <?php foreach ($plans as $plan): ?>
            <tr>
                <td>
                    <div class="ui title"><?= $plan['title'] ?></div>
                    <div class="ui content">
                        <table class="ui table">
                            <tbody class="accordion">
                                <?php foreach($plan['animals'] as $mp): ?>
                                                    <?php if($mp['blocks'] != null): ?>
                                <tr>
                                    <td>
                                        <div class="ui title"><?= $mp['animal']?></div>
                                        <div class="ui content">
                                            <table class="ui selectable table">
                                                <thead>
                                                    <th>Исследование</th>
                                                    <th>Квартал</th>
                                                    <th>Квартальный план</th>
                                                    <th>Годовой план</th>
                                                    <th>Действие</th>
                                                </thead>
                                                <tbody>
                                                    <?php foreach($mp['blocks'] as $bls): ?>
                                                    <tr>
                                                        <td><?= $bls['method'] ?></td>
                                                        <td><?= $bls['block'] ?></td>
                                                        <td><?= $bls['block_plan'] ?></td>
                                                        <td><?= $bls['plan'] ?></td>
                                                        <td>
                                                            <div class="ui icon mini buttons">
                                                                <a href="<?php echo Url::toRoute(['update', 'id' => $bls['id_mp']]) ?>" class="ui blue button"><i class="icon edit"></i></a>
                                                                <a id="<?php echo $bls['id_mpy'] ?>" class="ui yellow button" onclick="showModal()"><i class="icon plus"></i></a>
                                                                <div class="ui red icon top left pointing dropdown button">
                                                                    <i class="icon trash"></i>
                                                                    <i class="icon dropdown"></i>
                                                                    <div class="menu">
                                                                        <a href="<?php echo Url::toRoute(['delete-block', 'id' => $bls['id_mp']]) ?>" class="item">Квартальный план</a>
                                                                        <a href="<?php echo Url::toRoute(['delete-plan', 'id' => $bls['id_mpy']]) ?>" class="item">Годовой план</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <div id="modalCreate" class="ui tiny modal">
        <div class="center aligned header">
            Добавление квартала
        </div>
        <div class="content">
            <div class="ui form description">
            <label>Квартал
                <input v-model="block" type="number"></input>
            </label>
            <label>Квартальный план
                <input v-model="block_plan" type="number"></input>
            </label>
            </div>
        </div>
        <div class="actions">
            <button class="ui deny orange button">Отмена</button>
            <button class="ui approve green button" onclick="createBlock()">Добавить</button>
        </div>
    </div>
</div>
<script>$('.ui.accordion').accordion();</script>
<script>$('.dropdown').dropdown();</script>