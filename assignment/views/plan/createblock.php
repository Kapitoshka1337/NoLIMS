<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/edit.js');
?>
<div class="ui two column centered padded grid" id="getInfo">
    <div class="eight wide column">
        <form class="ui form" action="/assignment/plan-create-block" method="post">
            <div class="two fields">
                <div class="field">
                    <label>Квартал</label>
                    <select name="id_block[]" id="block" class="ui fluid search dropdown" multiple="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="field">
                    <label>План</label>
                    <input type="text" name="amount">
                    <input type="text" name="id_mpy" value="<?php echo $id_mpy ?>" hidden>
                </div>
            </div>
            <div class="ui two bottom attached buttons">
                <button class="ui green button" type="submit">Добавить</button>
                <button class="ui orange button" type="button" v-on:click="Cancel()">Отмена</button>
            </div>
        </form>
    </div>
</div>