<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
            {{ isMaterial.material }}
            <div class="meta">{{ isMaterial.location }}</div>
        </div>
		<sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Местоположение</label>
                    <sui-dropdown placeholder="Местоположение" search selection :options="forDropdown" v-model="selectedIdLocation"></sui-dropdown>
                </sui-form-field>
            </sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button color="green" v-on:click="saveLocations" v-bind:loading="loading">Сохранить</sui-button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
export default {
	props: {
		open: Boolean,
        material: Object,
		locations: Array,
		selectedIdLocation: null,
		loading: false
	},
	data(){
		return {
		}
	},
	computed:{
		show(){
			return this.open
		},
		isMaterial(){
			return this.material;
		},
        forDropdown(){
            if(this.locations.length)
            {
                let rows = [];
                for(let item in this.locations){
                    rows.push({
                        key: this.locations[item].id,
                        value: this.locations[item].id,
                        text: this.locations[item].cabinet_number + " " + this.locations[item].place + " " + this.locations[item].notation
                    });
                }
                return rows;
            }
        }
	},
	methods: {
		hide(){
			this.$emit('close');
		},
		saveLocations(){
			this.loading = !this.loading;
			this.$http.put("/api/reagent/arrivals/updloc/" + this.isMaterial.arrival_material_id, {id_location: this.selectedIdLocation})
			.then((response) =>{
			//	var idx = this.selectedEquipments.indexOf(equipment);
			//if (idx > -1) this.selectedEquipments.splice(idx, 1);
				this.$emit('success', this.forDropdown.find(x => x.key === this.selectedIdLocation));
			}).catch(error => (alert(error.response.data.message)));
		},
	}
}
</script>