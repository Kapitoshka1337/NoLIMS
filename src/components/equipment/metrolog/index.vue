<template>
	<div class="padded" is="sui-grid">
		<sui-grid-row>
			<sui-grid-column>
				<sui-menu :width="3">
					<router-link to="/equipment/metrolog/equipments" is="sui-menu-item">Оборудование</router-link>
					<router-link to="#" is="sui-menu-item">Проверки</router-link>
					<router-link to="#" is="sui-menu-item">Ремонт</router-link>
					<router-link to="#" is="sui-menu-item">План-график</router-link>
				</sui-menu>
				<router-view></router-view>
			</sui-grid-column>
		</sui-grid-row>
	</div>
</template>

<script>
	export default {
	data () {
		return {
			}
		}
	}
</script>