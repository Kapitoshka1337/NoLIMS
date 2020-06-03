<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js'); 
    $this->registerJsFile('@web/assets/js/assignment/modal.js'); 
?>
<div class="row" id='append'>
    <div class="sixteen wide column">
        <div class="ui fluid card">
            <div class="content">
                <div class="ui form">
                    <div class="three fields">
                        <div class="field">
                            <label>Ветстанция</label>
                            <select class="ui search dropdown" v-model="form.id_vetstation">
                                <option v-for="vet in listVetstation" v-bind:value="vet.ID">{{ vet.Title }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Район</label>
                            <select class="ui search dropdown" v-model="form.id_region">
                                <option v-for="region in filteredRegion" v-bind:value="region.ID">{{ region.Title }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Предприятие</label>
                            <select class="ui search dropdown" v-model="form.id_farm">
                                <option v-for="farm in filteredFarm" v-bind:value="farm.ID">{{ farm.Title }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="ui form">
                    <div class="four fields">
                        <div class="field">
                            <label>Животное</label>
                            <select class="ui search dropdown" v-model="form.id_animal">
                                <option v-for="animal in listAnimal" v-bind:value="animal.ID">{{ animal.Title }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Исследование</label>
                            <select class="ui search dropdown" multiple v-model="form.id_method">
                                <option v-for="method in filteredMethod" v-bind:value="method.mp_id">{{ method.method }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Количество</label>
                            <input type="text" v-model="form.amount">
                        </div>
                        <div class="field">
                            <label>Дата поступления</label>
                            <input type="date" v-model="form.date">
                        </div>
                    </div>
                    <div class="field">
                        <label>Место отбора</label>
                        <input type="text" v-model="form.place">
                    </div>
                </div>
            </div>
                <div class="content">
                    <a href="<?php echo Url::toRoute(['assignment/']) ?>" class="ui right floated orange button">Отмена</a>
                    <a class="ui right floated green button" v-on:click="submit()">Сохранить</a>
                </div>
        </div>
    </div>
</div>
<!-- <div class="ui two column centered padded grid">
    <div id="addForm" class="nine wide column">
        <form class="ui form" method="post" action="/assignment/create-record">
            <div class="fields">
                <div class="eight wide field">
                    <label>Вет.станция</label>
                    <select name="vetstation" id="vet" class="ui search dropdown" v-model="obj.vetstation" v-on:change="getRegion($event)">
                        <option value=""></option>
                        <?php $jsonData = json_decode($data, true) ?>
                        <?php foreach ($jsonData as $inf): ?>
                        <option value="<?php echo $inf['id_vet'] ?>"><?= $inf['title'] ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="eight wide field">
                    <label>Район</label>
                    <select name="region" id="region" class="ui search dropdown" v-model="obj.region" v-on:change="getFarm($event)">
                        <option v-for="opt in listRegion" v-bind:value="opt.id_reg">{{ opt.title }}</option>
                    </select>
                </div>
            </div>
            <div class="fields">
                    <div class="fifteen wide field">
                        <label>Предприятие</label>
                        <select name="farm" id="farm" class="ui search dropdown" v-model="obj.farm">
                            <option v-for="opt in listFarm" v-bind:value="opt.id_farm">{{ opt.title }}</option>
                        </select>
                    </div>
                    <div class="two wide field ggh">
                       <label class="btnToDown">ForDown</label>
                        <a v-on:click="createFarm()" class="ui green basic icon button"><i class="plus square icon"></i></a>
                    </div>
            </div>
            <div class="fields">
                <div class="four wide field">
                    <label>Животное</label>
                    <select name="animal" id="animal" class="ui search dropdown" v-model="obj.animal" v-on:change="getMethod($event)">
                        <option value=""></option>
                        <?php $jsonData = json_decode($animal, true) ?>
                        <?php foreach ($jsonData as $inf): ?>
                            <option value="<?php echo $inf['id_animal'] ?>"><?= $inf['title'] ?></option>
                        <?php endforeach; ?>
                    </select> 
                </div>
                <div class="twelve wide field">
                    <label>Исследование</label>
                    <select name="method[]" id="method" class="ui fluid search dropdown" multiple="" v-model="obj.method">
                        <option v-for="opt in listMethod" v-bind:value="opt.id_method">{{ opt.title }}</option>
                    </select>
                </div>
            </div>
            <div class="fields">
                <div class="four wide field">
                    <label>Количество</label>
                    <input name="amount" type="number" min="0" value="0" v-model="obj.amount">
                </div>
                <div class="five wide field">
                    <label>Дата</label>
                    <input name="date" type="date" v-bind:value="today" v-model="obj.dateAdd">
                </div>
                <input name="date_enter" type="date" v-bind:value="today" v-model="obj.date_enter" hidden readonly>
                <input name="empl" type="text" value="<?php echo Yii::$app->user->identity['ID']?>" hidden readonly>
            </div>
            <div class="ui two bottom attached buttons">
                <button class="ui green button" type="submit">Добавить</button>
                <button class="ui orange button" type="button" v-on:click="toHome()">Отмена</button>
            </div>
        </form>
        <div id="modal" class="ui tiny modal">
            <div class="centered header">
                Предприятие
            </div>
            <div class="content">
                <div class="ui form description">                                
                    <label>Район
                        <input v-model="region" type="text" readonly></input>
                    </label>
                    <label>Предприятие
                        <input type="text" v-model="farm.farm" autofocus>
                    </label>
                </div>
            </div>
            <div class="actions">
                <button class="ui deny orange button">Отмена</button>
                <button class="ui approve green button" type="submit" v-on:click="SaveFarm()">Добавить</button>
            </div>
        </div>
    </div>
</div> -->