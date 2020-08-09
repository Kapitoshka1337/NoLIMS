<template>
    <div>
        <sui-menu :width="3">
            <router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
            <router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
            <router-link to="/reagent/writeoff" is="sui-menu-item">Списание</router-link>
            <router-link to="#" is="sui-dropdown" item simple text="Передача">
                <sui-dropdown-menu>
                    <router-link to="/reagent/moving" is="sui-dropdown-item" item>Запрос</router-link>
                    <router-link to="/reagent/moving/history" is="sui-dropdown-item" item>История</router-link>
                </sui-dropdown-menu>
            </router-link>
            <router-link to="/reagent/locations" is="sui-menu-item">Местоположение</router-link>
        </sui-menu>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return {
            
        }
    }
}
</script>