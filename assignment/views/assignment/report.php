<?php
    $this->registerJsFile('@web/assets/vendor/jquery/jquery.js');
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerCssFile('@web/assets/vendor/webdatarocks/webdatarocks.css');
    $this->registerJsFile('@web/assets/vendor/webdatarocks/webdatarocks.toolbar.js');
    $this->registerJsFile('@web/assets/vendor/webdatarocks/webdatarocks.js');
    $this->registerJsFile('@web/assets/js/assignment/pivottable.js');
?>
<div class="row">
    <div class="column">
    <div class="ui pointing menu" id="menu">
        <div class="left menu">
            <a class="item" v-on:click="getGeneral()">Основой отчет</a>
            <a class="item" v-on:click="getGreater()">Отчет по превышениям</a>
        </div>
    </div>
    </div>
</div>
<div class="row">
	<div class="column">
        <div id="wdr-component"></div>
	</div>
</div>