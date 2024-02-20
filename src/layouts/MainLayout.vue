<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img style="filter:invert(1)" src="https://www.svgrepo.com/show/500416/pix.svg">
          </q-avatar>
          Pixshop
        </q-toolbar-title>
        Olá,⠀<strong>Usuário</strong>
        <q-btn class="q-ml-sm" dense flat round icon="shopping_cart" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>


    <q-drawer style="border-left: 2px solid #30b6a994;" show-if-above v-model="rightDrawerOpen" side="right">
      <h5 id="carrinho-title">Meu Carrinho</h5>
      <div class="q-pa-sm w100 row justify-between">
        <span>Items: <strong>0</strong></span>
        <span>Total: <strong>R$ 00,00</strong></span>
      </div>
      <q-list class="right-menu">
        <q-item v-for="(item, index) in rightDrawerItems" :key="index">
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
          <q-item-section side="right">
            <q-icon :name="item.icon" />
          </q-item-section>
        </q-item>
        <div class="row justify-center q-my-md q-pb-lg">
          <q-btn label="Admin" icon="admin_panel_settings" color="warning" @click="navigate('/admin')"/>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const rightDrawerOpen = ref(false)
    const router = useRouter()

    const leftDrawerItems = [
      { text: 'Item 1', icon: 'mdi-home' },
      { text: 'Item 2', icon: 'mdi-account' },
      { text: 'Item 3', icon: 'mdi-settings' }
    ]

    const rightDrawerItems = [
      { text: 'Carrinho', icon: 'shopping_cart' }
    ]

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    const navigate = (to) => {
      router.replace(to)
    }

    return {
      navigate,
      rightDrawerOpen,
      leftDrawerItems,
      rightDrawerItems,
      toggleLeftDrawer,
      toggleRightDrawer
    }
  }
})
</script>
<style scoped>
.right-menu {
  background: #f0f0f0;
}
#carrinho-title{
  margin: 0px 0px!important;
  padding: 24px 0px!important;
  text-align: center;
  background-color: #c7c7c751;
}
</style>