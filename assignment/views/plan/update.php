<?php 
$id = $record[0]['vet_id'];
$an = $record[0]['animal_id'];
$mp = $record[0]['method_id'];
?>
<div class="ui two column centered padded grid" id="getInfo">
        <div class="six wide column">
            <form class="ui form" action="/assignment/update" method="post">
                <div class="three fields">
                    <div class="nine wide field">
                    	<label>ID</label>
                    	<input name="id" type="text" value="<?php echo $record[0]['id'] ?>">
                        <input name="id_mpy" type="text" value="<?php echo $record[0]['id_mpy'] ?>" hidden readonly>
                	</div>
                    <div class="nine wide field">
                    	<label>Вет.станция</label>
                        <select name="vetstation" id="vet" class="ui search dropdown">
                            <option value=""></option>
                            <?php $jsonData = json_decode($data, true) ?>
                            <?php foreach ($jsonData as $inf): ?>
                            <option value="<?php echo $inf['id_vet'] ?>" <?php if($inf['id_vet'] == $id) {echo "selected";}?>><?= $inf['title'] ?></option>
                            <?php endforeach; ?>
                        </select>
                    	<!-- <input type="text" value="echo $record[0]['vet']" disabled="disabled">	 -->
                	</div>
                    <div class="seven wide field">
                    	<label>Животное</label>
                        <select name="animal" id="animal" class="ui search dropdown">
                            <option value=""></option>
                            <?php $jsonData = json_decode($animal, true) ?>
                            <?php foreach ($jsonData as $inf): ?>
                            <option value="<?php echo $inf['id_animal'] ?>" <?php if($inf['id_animal'] == $an) {echo "selected";}?>><?= $inf['title'] ?></option>
                            <?php endforeach; ?>
                        </select>
                    	<!-- <input type="text" value="echo $record[0]['animal']" disabled="disabled"> -->
                	</div>
                </div>
                <div class="sixteen wide field">
                	<label>Исследование</label>
                    <select name="method" id="method" class="ui search dropdown">
                        <option value=""></option>
                        <?php $jsonData = json_decode($method, true) ?>
                        <?php foreach ($jsonData as $inf): ?>
                        <option value="<?php echo $inf['id'] ?>" <?php if($inf['id'] == $mp) {echo "selected";}?>><?= $inf['title'] ?></option>
                        <?php endforeach; ?>
                    </select>
                	<!-- <input type="text" value="<?php echo $record[0]['method'] ?>" disabled="disabled"> -->
                </div>
                <div class="two fields">
                    <div class="four wide field">
            			<label>Квартал</label>
            			<input name="block" type="text" value="<?php echo $record[0]['block'] ?>">
                    </div>
                    <div class="four wide field">
            			<label>Кварт. план</label>
            			<input name="block_plan" type="text" value="<?php echo $record[0]['block_plan'] ?>">
                    </div>
                    <div class="eight wide field">
            			<label>Годовой план</label>
            			<input name="plan" type="text" value="<?php echo $record[0]['plan'] ?>">
                    </div>
                </div>
                <div class="ui two bottom attached buttons">
                    <button class="ui green button" type="submit">Изменить</button>
                    <button class="ui orange button" type="button" id="Cancel">Отмена</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
	$('#Cancel').click(function(){
		document.location.href = '/assignment/edit';
	});
</script>