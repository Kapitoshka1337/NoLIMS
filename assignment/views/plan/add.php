<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js'); 
    $this->registerJsFile('@web/assets/js/assignment/plan.js'); 
?>
<div class="ui two column centered padded grid" id="getInfo">
    <div class="eight wide column">
        <form class="ui form" v-on:submit.prevent="Save()">
            <div class="two fields">
                <div class="field">
                    <label>Вет.станция</label>
                    <select name="vetstation" id="vets" class="ui search dropdown" v-model="obj.vetstation">
                        <option v-for="opt in listVet" v-bind:name="opt" v-bind:value="opt.id">{{ opt.title }}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Животное</label>
                    <select name="animal" id="animal" class="ui search dropdown" v-model="obj.animal">
                        <option v-for="opt in listAnimal" v-bind:value="opt.id">{{ opt.title }}</option>
                    </select>
                </div>
            </div>
            <div class="two fields">
                <div class="twelve wide field">
                    <label>Исследование</label>
                    <select name="method" id="method" class="ui fluid search dropdown" v-model="obj.method">
                        <option v-for="opt in listMethod" v-bind:value="opt.value">{{ opt.text }}</option>
                    </select>
                </div>
                <div class="four wide field">
                    <label>Годовой план</label>
                    <input name="amount" type="text" v-model="obj.amount">
                </div>
            </div>
            <div class="ui two bottom attached buttons">
                <button class="ui green button" type="submit">Добавить</button>
                <button class="ui orange button" type="button" v-on:click="Cancel()">Отмена</button>
            </div>
        </form>
        <div class="ui segment" v-show="visible">
        <form class="ui form" v-on:submit.prevent="blockSave()">
            <div class="two fields">
                <div class="field">
                    <label>Квартал</label>
                    <select name="block[]" id="block" class="ui fluid search dropdown" multiple="" v-model="block.id_block">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="field">
                    <label>План</label>
                    <input type="text" v-model="block.amount">
                </div>
            </div>
            <div class="ui two bottom attached buttons">
                <button class="ui green button" type="submit">Добавить</button>
                <button class="ui orange button" type="reset" v-on:click="CancelBlock()">Сброс</button>
            </div>
        </form>
        </div>
    </div>
</div>