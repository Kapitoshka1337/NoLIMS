<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/vendor/html2pdf.bundle.min.js');
?>
<div class="sixteen wide column">
	<h1><?= $this->context->action->uniqueId ?></h1>
	<input type="button" onclick='test()'>
	<table class="ui table celled sixteen column" id="element-to-print">
		<tbody>
			<tr>
				<td>ДФ.04.31.2017</td>
					<td class="thirteen wide">
						<div class="label center aligned">БУ УР УВДЦ</div>
						<div class="label center aligned">Система менеджмента качества ИЦ</div>
						<div class="label center aligned">Документрированная форма</div>
						<div class="label center aligned">Регистрационная карточка оборудования</div>
					</td>
				</td>
				<td>лицевая сторона регистрационной карточки</td>
			</tr>
		</tbody>
	</table>
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