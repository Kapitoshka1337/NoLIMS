<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			Заказ № {{ order.num_order }} от {{ order.date_order }}
		</div>
		<sui-modal-content scrolling>
            <sui-table compact>
                <sui-table-header>
                    <sui-table-row>
                        <sui-table-header-cell>asd</sui-table-header-cell>
                    </sui-table-row>
                </sui-table-header>
                <sui-table-body>
                    <sui-table-row>
                        <sui-table-cell>asd</sui-table-cell>
                    </sui-table-row>
                </sui-table-body>
            </sui-table>
		</sui-modal-content>
		<sui-modal-actions>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
export default {
	props: {
        open: Boolean,
        order: Object
	},
	data(){
		return {
        }
	},
	computed:{
		show(){
			return this.open
		}
    },
    methods: {
		hide(){
			this.$emit('close');
		},
    }
}
</script>