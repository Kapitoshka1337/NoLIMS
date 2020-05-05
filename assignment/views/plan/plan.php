<?php
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js');
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js'); 
?>
<div class="sixteen wide column">
	<table class="ui table" id="detailPlan">
		<tbody class="ui accordion">
		<?php foreach ($plans as $plan): ?>
			<tr>
				<td>
					<div class="ui title"><?= $plan['title'] ?></div>
					<div class="ui content">
						<table class="ui table">
							<tbody class="accordion">
								<?php foreach($plan['animals'] as $mp): ?>
													<?php if($mp['blocks'] != null): ?>
								<tr>
									<td>
										<div class="ui title"><?= $mp['animal']?></div>
										<div class="ui content">
											<table class="ui selectable table">
												<thead>
													<th>Исследование</th>
													<th>Квартал</th>
													<th>Квартальный план</th>
													<th>Годовой план</th>
												</thead>
												<tbody>
													<?php foreach($mp['blocks'] as $bls): ?>
													<tr>
														<td><?= $bls['method'] ?></td>
														<td><?= $bls['block'] ?></td>
														<td><?= $bls['block_plan'] ?></td>
														<td><?= $bls['plan'] ?></td>
													</tr>
													<?php endforeach; ?>
												</tbody>
											</table>
										</div>
									</td>
								</tr>
													<?php endif; ?>
								<?php endforeach; ?>
							</tbody>
						</table>
					</div>
				</td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>
<script>$('.ui.accordion').accordion();</script>