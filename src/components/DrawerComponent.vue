<template>
  <q-drawer class="q-pa-md animate__animated animate__fadeIn" style="border-left: 2px solid #30b6a994;" show-if-above side="right">
    <h5 id="carrinho-title">Meu Carrinho</h5>
    <div class="q-pa-sm w100 row justify-between" style="background: #71baffaf;">
      <span>Items: <strong>{{ cartStore.items.length }}</strong></span>
      <span>Total: <strong>R$ {{ cartStore.totalPrice.toFixed(2) }}</strong></span>
    </div>
    <q-list class="right-menu">
      <q-item v-for="(item, index) in cartStore.items" :key="index">
        <q-item-section>
          <q-item-label>( <strong>{{ item.quantidade }}</strong> ) - {{ item.nomeProduto }}</q-item-label>
        </q-item-section>
          <q-icon name="remove" size="md" color="red-8" @click="removeItem(item)"/>
      </q-item>
      <div class="row justify-center q-pb-lg absolute-bottom">
        <q-btn label="Admin" icon="admin_panel_settings" color="warning" @click="navigate('/admin')"/>
      </div>
    </q-list>
    <div class="acoes q-mt-lg">
      <p class="q-mt-md q-py-md w100 text-center cursor-pointer finalizar" @click="cartStore.clearCart()">Finalizar Pedido <q-icon name="payments" size="sm" class="q-pl-md"/></p>
      <p class="q-py-md w100 text-center cursor-pointer limpar" @click="cartStore.clearCart()">Limpar carrinho <q-icon name="remove_shopping_cart" size="sm" class="q-pl-md"/></p>
    </div>
  </q-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/CartStore';

const router = useRouter();
const cartStore = useCartStore();

const navigate = (to) => {
  router.replace(to);
};

function removeItem(item) {
  cartStore.removeItem(item._id)
}


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
.limpar, .finalizar{
  transition: all .3s linear;
}
.finalizar{
 background-color: #9eff9e94;
}
.finalizar:hover {
  background-color: #63ff63cc;
}
.limpar:hover{
  background-color: #ff989477;
}
.acoes {
  border-radius: 4px;
  border: 2px solid #71baffaf;
}
p{
  margin: 0;
}
</style>
