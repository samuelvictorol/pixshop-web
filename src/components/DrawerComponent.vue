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
      <p class="q-mt-md q-py-md w100 text-center cursor-pointer finalizar" @click="finalizarPedido()">Finalizar Pedido <q-icon name="payments" size="sm" class="q-pl-md"/></p>
      <p class="q-py-md w100 text-center cursor-pointer limpar" @click="cartStore.clearCart()">Limpar carrinho <q-icon name="remove_shopping_cart" size="sm" class="q-pl-md"/></p>
    </div>
  </q-drawer>
  <div v-if="qr" class="modal">
    <div class="column items-center" id="qrcode-waiting">
      <div class="lds-grid q-my-md"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <p class="blinking text-blue-10 text-bold q-pa-sm rounded-borders">Aguardando pagamento...</p>
      <q-btn @click="paymentRedirect" color="primary" class="q-mt-md" icon="help" label="Link não abriu ?"/>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/CartStore';
import { ref } from 'vue'
import { api } from 'src/boot/axios';
const qr = ref(false)
const router = useRouter();
const cartStore = useCartStore();
const handleLinkPayment = ref(null)

const navigate = (to) => {
  router.replace(to);
};

function removeItem(item) {
  cartStore.removeItem(item._id)
}

const toggleModal = () => {
  qr.value = !qr.value
}

function finalizarPedido() {
  toggleModal();

  if (qr.value) {
     api.post('/openpix', {valorTotal: cartStore.totalPrice.toFixed(2)})
      .then(res => {
        console.log(res.data.pixQrCode.paymentLinkUrl)
        handleLinkPayment.value = res.data.pixQrCode.paymentLinkUrl
      })
      .catch(err => console.error(err))
      .finally(paymentRedirect)
  }
}

const paymentRedirect = () => {
  const novaJanela = window.open('', '_blank');
  novaJanela.location.href = handleLinkPayment.value
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

.lds-grid {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-grid div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
@keyframes blink {
  0% { opacity: .9; }
  50% { opacity: .4; }
  100% { opacity: .9; }
}

.blinking {
  background-color: #fff;
  animation: blink 5s ease-in-out infinite;
}

</style>
