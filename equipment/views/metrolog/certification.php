<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/vendor/html2pdf.bundle.min.js');
	$this->registerJsFile('@web/assets/vendor/ser.js');
?>
<h1><?= $this->context->action->uniqueId ?></h1>
<div class="row" id="ser">
    <div class="sixteen wide column">
        <div class="ui fluid card">
            <div class="content">
                <div class="ui form">
                    <div class="three fields">
                        <div class="field">
                            <label>Ветстанция</label>
                            <select class="ui search dropdown" v-model="eq.id_department" v-on:change="filteredLocation(eq.id_department)">
                                <option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Район</label>
                            <select class="ui search dropdown" v-model="eq.id_location">
                                <option v-for="location in listLocations" v-bind:value="location.id">{{ location.cabinet_number }} {{ location.place }} {{ location.notation }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Предприятие</label>
                            <select class="ui search dropdown" v-model="eq.id_equipment_type">
                                <option v-for="type in listType" v-bind:value="type.id">{{ type.title }}</option>
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
                            <input type="text" v-model="eq.model">
                        </div>
                        <div class="field">
                            <label>Исследование</label>
                            <input type="text" v-model="eq.serial_number">
                        </div>
                        <div class="field">
                            <label>Количество</label>
                            <input type="text" v-model="eq.inventory_number">
                        </div>
                        <div class="field">
                            <label>Дата поступления</label>
                            <input type="date" v-model="eq.date_create">
                        </div>
                    </div>
                    <div class="field">
                        <label>Место отбора</label>
                        <input type="text" v-model="eq.number">
                    </div>
                </div>
            </div>
                <div class="content">
                    <a href="<?php echo Url::toRoute(['equipments/']) ?>" class="ui right floated orange button">Отмена</a>
                    <a class="ui right floated green button" v-on:click="Submit()">Сохранить</a>
                </div>
        </div>
    </div>
</div>
<!-- <div class="sixteen wide column"> -->
<!--     <div class="ui cards">
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
    </div> -->
<!-- </div> -->
<!-- 	<script>
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
	</script> -->