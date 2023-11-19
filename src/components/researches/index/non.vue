<template>
    <v-form @submit.prevent>
      <div>
        <keep-alive>
          <component v-bind:is="component"></component>
        </keep-alive>
      </div>
      <v-btn v-on:click=add()
        >Добавить следующий образец в данное направление</v-btn
      >
      <v-btn type="submit" block class="mt-2" @click="submit()" :loading="loading" v-bind:disabled="isTime">Сформировать направление</v-btn>
    </v-form>
  </template>
  
  
    
    <script>
  import component from "./component.vue";
  
  export default {
    components: {
      comp: component,
    },
    data() {
      return {
        component: "comp",
      };
    },
    methods: {
          submit(){
              if(this.getInternalSubmit)
              {
                  this.$emit('submit', this.passedData);
                  this.loading = true;
                  return true;
              }
  
              let formData = new FormData();
              formData.append('department', this.passedData.department);
              formData.append('regnum', this.passedData.regnum);
              formData.append('name', this.passedData.name);
              formData.append('massa', this.passedData.massa);
              formData.append('indicator', this.passedData.indicator);
              formData.append('si', this.passedData.si);
              formData.append('metod', this.passedData.metod);
              formData.append('note', this.passedData.note);
              this.loading = true;
              this.$http.post(`/api/samples/index/create`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
              .then(response => (this.closeDialog())).catch(error => (alert(error.response.data.message), this.closeDialog()));
          }
    },
  };
  </script>