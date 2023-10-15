<template>
	<v-dialog dense fullscreen transition="dialog-bottom-transition" v-model="dialogCloseOpen">
		<v-card>
			<v-toolbar dense dark color='primary'>
				<v-toolbar-title>Руководство пользователя</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click="dialogClose(false)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-card-text>
				<v-row>
					<component v-bind:is="guideComponent"></component>
				</v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import hub from './hub.vue';
// import gz from './gz.vue';
import reagent from './reagent.vue';
import equipment from './equipment.vue';
import researches from './researches.vue';

export default {
	components: {
		hub: hub,
		// gz: gz,
		reagent: reagent,
		equipment: equipment,
		researches: researches,
	},
	props: {
		dialogOpen: false,
	},
	data() {
		return {}
	},
	methods:{
		dialogClose(value){
			this.$emit('close', value);
		}
	},
	computed: {
		dialogCloseOpen:{
			get(){
				return this.dialogOpen;
			},
			set(value){
				this.dialogClose(value);
			}
		},
		guideComponent(){
			return this.$route.matched[0].meta.name;
		},
	}
}
</script>