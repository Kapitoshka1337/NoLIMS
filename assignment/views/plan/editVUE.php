<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/edit.js');
?>
<div class="sixteen wide column" id="createblock">
    <div class="ui menu table-head">
        <div class="right menu">
            <a href="<?php echo Url::toRoute(['/farm']) ?>" class="item">Предприятия</a>
            <a href="<?php echo Url::toRoute(['/method']) ?>" class="item">Исследования</a>
            <a href="<?php echo Url::toRoute(['/animal']) ?>" class="item">Животные</a>
            <a href="<?php echo Url::toRoute(['/plan-create']) ?>" class="item">Добавить план</a>
        </div>
    </div>
    <table class="ui table">
        <tbody class="ui accordion">
            <tr v-for="plan in listMethods">
                <td>
                    <div class="ui title">{{ plan.title }}</div>
                    <div class="ui content">
                        <table class="ui table">
                            <tbody class="accordion">
                                <tr v-if="mp.blocks !== null" v-for="mp in plan.animals">
                                    <td>
                                        <div class="ui title">{{ mp.animal }}</div>
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
                                                    <tr v-for="bls in mp.blocks">
                                                        <td>{{ bls.method }}</td>
                                                        <td>{{ bls.block }}</td>
                                                        <td>{{ bls.block_plan }}</td>
                                                        <td>{{ bls.plan }}</td>
                                                        <td>
                                                            <div class="ui icon mini buttons">
                                                                <a v-bind:href="'/edit/' + bls.id_mp" class="ui blue button"><i class="icon edit"></i></a>
                                                                <a v-on:click="showModal('Create', bls.id_mpy)" class="ui yellow button"><i class="icon plus"></i></a>
                                                                <div class="ui red icon top left pointing dropdown button">
                                                                    <i class="icon trash"></i>
                                                                    <i class="icon dropdown"></i>
                                                                    <div class="menu">
                                                                        <a v-bind:href="'/delete-block/' + bls.id_mp" class="item">Квартальный план</a>
                                                                        <a v-bind:href="'/delete-plan/' + bls.id_mpy" class="item">Годовой план</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
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
            <button class="ui approve green button" v-on:click="createBlock()">Добавить</button>
        </div>
    </div>
</div>
<!-- <script>$('.ui.accordion').accordion();</script> -->
<!-- <script>$('.dropdown').dropdown();</script> -->