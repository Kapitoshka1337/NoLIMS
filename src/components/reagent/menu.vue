<template>
    <sui-grid-column>
        <div is="sui-menu" :width="3">
            <router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
            <router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
            <router-link to="#" is="sui-menu-item">Списание</router-link>
            <router-link to="#" is="sui-menu-item">
                <sui-dropdown text="Передача">
                    <sui-dropdown-menu>
                        <sui-dropdown-item>Запрос</sui-dropdown-item>
                        <sui-dropdown-item>История</sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </router-link>
        </div>
        <!-- <router-view></router-view> -->
    </sui-grid-column>
</template>

<script>
export default {
    data(){
        return {
            
        }
    }
}
</script>