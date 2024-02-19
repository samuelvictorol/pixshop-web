<template>
  <q-page class="flex flex-center q-pb-xl">
    <h6 class="w100 row no-wrap text-center">Pixshop 
      <img class="q-ml-sm svg-pix" style="width:30px" src="https://www.svgrepo.com/show/500416/pix.svg" alt="pix">
    </h6>
    <div class="row q-pl-lg q-gutter-lg">
      <q-card class="my-card" v-for="product in products" :key="product._id">
        <img :src="product.imgProduct" alt="Product Image"  class="product-image">
        <q-card-section>
          <div class="row no-wrap justify-between">
            <div class="text-h6">{{ product.nomeProduto }}</div>
            <img style="width:30px" src="https://www.svgrepo.com/show/500416/pix.svg" alt="pix">
          </div>
          <div class="text-subtitle2">Por: R$ {{ product.valorPromocional ? product.valorPromocional : product.valor }}</div>
          <div :style="{ 'text-decoration': product.valorPromocional ? 'line-through' : 'none', 'visibility': product.valorPromocional ? 'visible' : 'hidden' }" class="text-subtitle3 low-opacity">De: R$ {{ product.valor }}</div>
          <p class="q-mt-xs">
            {{ product.descricaoProduto }}
          </p>
        <q-btn
          class="w100"
          color="primary"
          label="Comprar"
          icon="shopping_cart"
          @click="() => $router.push({ name: 'product', params: { id: product._id } })"/>
        </q-card-section>
        </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onBeforeMount, ref } from 'vue'

const products = ref([])

onBeforeMount(async () => {
  await api.get('/products')
    .then(response => {
      console.log(response.data)
      products.value = response.data
    })
    .catch(error => {
      console.log(error)
    })
})
</script>
<style scoped>
.q-card {
  width: 320px;
}
.q-card:hover {
  transition: all 0.15s linear;
  transform: scale(1.02);
  cursor: pointer;
}
.product-image {
  max-width: 90%;
  height: 300px;
  object-fit: contain;
  display: block;
  margin: auto;
}
h6{
  margin: 18px 22px;
  padding: 0 0;
  font-size: 2.5rem;
  font-weight: 500;
  color: #30b6a9;
}
.svg-pix {
  filter: invert(1);
  opacity: 0.4;
}
</style>