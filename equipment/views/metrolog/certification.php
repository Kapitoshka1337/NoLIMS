<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/vendor/html2pdf.bundle.min.js');
?>
<div class="sixteen wide column">
	<h1><?= $this->context->action->uniqueId ?></h1>
	<input type="button" onclick='test()'>
<!-- 	<div class="ui three cards">
		<div class="card">
			<div class="content">
				<div class="label">Отдел Биохимии и радиологии</div>
				<div class="label">Наименовение, тип <br> Атомно-абсорбционный спектрометр Атомно-абсорбционный спектрометр</div>
				<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
				<div class="label">Заводской номер 12151251asda</div>
				<div class="label">Инветарный номер 12567656785</div>
				<div class="label">Дата пройденной 01.02.1243</div>
				<div class="label">Дата следующей 12.12.1251</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="label">Отдел Биохимии и радиологии</div>
				<div class="label">Наименовение, тип <br> Атомно-абсорбционный спектрометр Атомно-абсорбционный спектрометр</div>
				<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
				<div class="label">Заводской номер 12151251asda</div>
				<div class="label">Инветарный номер 12567656785</div>
				<div class="label">Дата пройденной 01.02.1243</div>
				<div class="label">Дата следующей 12.12.1251</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="label">Отдел Биохимии и радиологии</div>
				<div class="label">Наименовение, тип <br> Атомно-абсорбционный спектрометр Атомно-абсорбционный спектрометр</div>
				<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
				<div class="label">Заводской номер 12151251asda</div>
				<div class="label">Инветарный номер 12567656785</div>
				<div class="label">Дата пройденной 01.02.1243</div>
				<div class="label">Дата следующей 12.12.1251</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="label">Отдел Биохимии и радиологии</div>
				<div class="label">Наименовение, тип <br> Атомно-абсорбционный спектрометр Атомно-абсорбционный спектрометр</div>
				<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
				<div class="label">Заводской номер 12151251asda</div>
				<div class="label">Инветарный номер 12567656785</div>
				<div class="label">Дата пройденной 01.02.1243</div>
				<div class="label">Дата следующей 12.12.1251</div>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="label">Отдел Биохимии и радиологии</div>
				<div class="label">Наименовение, тип <br> Атомно-абсорбционный спектрометр Атомно-абсорбционный спектрометр</div>
				<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
				<div class="label">Заводской номер 12151251asda</div>
				<div class="label">Инветарный номер 12567656785</div>
				<div class="label">Дата пройденной 01.02.1243</div>
				<div class="label">Дата следующей 12.12.1251</div>
			</div>
		</div>
	</div> -->
	<table class="ui five column celled table" id="element-to-print">
<!-- 		<thead>
			<tr>
				<th>1</th>
				<th>2</th>
				<th>3</th>
				<th>4</th>
				<th>5</th>
			</tr>
		</thead> -->
		<tbody>
			<tr>
				<td>
					<div class="label">Отдел Биохимии и радиологии</div>
					<div class="label">Наименовение, тип <br>Весы электронные ПВм-3/6-ЖКИ-П с встроенным ПО версия 323Х</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
				<td>
					<div class="label">Отдел Биохимии и радиологии</div>
					<div class="label">Наименовение, тип <br>Гамма-Бета спектрометрический комплекс "Прогресс-БГ"с программным пакетом "Прогресс-2000"</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
				<td>
					<div class="label">Отдел Биохимии и радиологии</div>
					<div class="label">Наименовение, тип <br>Встряхиватель лабораторный ВП-8</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
				<td>
					<div class="label">Отдел Биохимии и радиологии</div>
					<div class="label">Наименовение, тип <br>Дозатор механический 1 канальный с варьируемым объемом дозирования 20-200мкл BIOHIT Proline</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
				<td>
					<div class="label">Отдел Биохимии и радиологии (СИ)</div>
					<div class="label">Наименовение, тип <br>Дозатор механический 8-канальный Sartorius Proline с переменным объемом дозирования (50-300) мкл</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
			</tr>
			<tr>
				<td>
					<div class="label">Отдел Биохимии и радиологии (СИ)</div>
					<div class="label">Наименовение, тип <br>Дозатор механический 8-канальный Sartorius Proline с переменным объемом дозирования (50-300) мкл</div>
					<div class="label">Рег.карта 128758 <span class="label">ФИФ 124</span></div>
					<div class="label">Заводской номер 12151251asda</div>
					<div class="label">Инветарный номер 12567656785</div>
					<div class="label">Дата пройденной 01.02.1243</div>
					<div class="label">Дата следующей 12.12.1251</div>
				</td>
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