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

    <DrawerComponent v-if="rightDrawerOpen"/>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import DrawerComponent from 'src/components/DrawerComponent.vue'

const rightDrawerOpen = ref(true)
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

</script>

