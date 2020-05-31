<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/vendor/html2pdf.bundle.min.js');
?>
<div class="eight wide column">
	<h1><?= $this->context->action->uniqueId ?></h1>
    <div class="ui cards">
        <div class="ui fluid card" v-for="data in paginateRows">
            <div class="content">
                <div class="header">Ветстанция (район)<span class="right floated header">Дата поступления</span></div>
                <div class="meta">Предприятие<span class="right floated meta">Животное (исследование)</span></div>
            </div>
            <div class="content">
                <div class="ui grid">
                    <div class="row">
                        <div class="sixteen wide column">
                            <div class="description">
                                <div class="ui horizontal list">
                                    <div class="item">Количество: 1</div>
                                    <div class="item"><span class="ui green label">Квартальный остаток/план: 1/1</span></div>
                                    <div class="item"><span class="ui green label">Годовой остаток/план: 1/1</span></div>
                                    <div class="item">Итого: 2</div>
                                </div>
                                <p>Место отбора: 2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="extra content">
                <div class="left floated">1903</div>
                <div class="right floated">Сотрудник</div>
            </div>
        </div>
    </div>
</div>
	<script>
		function test(){
		var element = document.getElementById('element-to-print');
		var opt = {
		  // margin:       0,
		  filename:     'myfile.pdf',
		  // image:        { type: 'jpeg', quality: 0.98 },
		  pagebreak: {mode: ['avoid-all']},
		  html2canvas:  { scale: 3 },
		  jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
		};
		html2pdf().set(opt).from(element).toPdf().save();
		// html2pdf(element);
		}
	</script>