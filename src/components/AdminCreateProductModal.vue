<template>
    <div class="modal animate__animated animate__fadeIn">
        <div class="wrapper w100 row no-wrap justify-center">
            <q-card class="q-ma-md q-pa-sm  ">
                <q-card-section>
                    <h5 class="text-primary">{{ titleModalCreate }} Produto</h5>
                    <div class="inputs-banner w100 column q-gutter-y-md q-mt-xs">
                        <q-input class="w100" type="text" v-model="product.nomeProduto" maxlength="50" label="Nome do Produto*"/>
                        <q-input class="w100" type="text" v-model="product.descricaoProduto" maxlength="100" label="Descrição do Produto*"/>
                        <div class="row w100 no-wrap">
                            <q-input class="w40 q-pr-md" v-model="product.valor" reverse-fill-mask prefix="R$" mask="#####,##" maxlength="8" label="Valor do Produto*"/>
                            <q-input class="w40" mask="###" v-model="product.stock" label="Estoque do Produto*"/>
                        </div>
                        <div class="row w100 no-wrap">
                            <q-select class="w40  q-pr-md"  v-model="promo" :options="options" label="Em promoção ?"/>
                            <q-input  v-if="promo  && promo.value === true" class="w40" v-model="product.valorPromocional" reverse-fill-mask prefix="R$" maxlength="8"  mask="#####,##" label="Valor Novo*"/>
                        </div>
                        <q-input class="w100" type="text" v-model="product.imgProduct" label="URL Imagem do Produto*"/>
                    </div>
                </q-card-section>
                <q-card-actions class="q-pr-md"  align="right">
                    <q-btn id="btn-cancelar-modal-admin" class="text-primary" label="Cancelar" @click="$emit('cancel')"/>
                    <q-btn color="primary" :label="titleModalCreate == 'Adicionar' ? 'Salvar' : 'Editar'" @click="titleModalCreate == 'Adicionar' ? salvar() : editar();" :disabled="checkSave()" />
                </q-card-actions>
            </q-card>
            <img v-if="product.imgProduct != ''" class="animate__animated animate__fadeIn animate__slower" style="filter:drop-shadow(0px 0px 4px #00000044);width: 300px; object-fit: contain;" :src="product.imgProduct" alt="Imagem do produto preview">
        </div>
    </div>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, defineProps, defineEmits, onBeforeMount  } from "vue";
import { useQuasar } from 'quasar';

const emit = defineEmits(['fetchData']);

const props = defineProps({
    titleModalCreate: String,
    editObject: Object
});

const $q = useQuasar();

const product = ref({
    nomeProduto: '',
    descricaoProduto: '',
    valor: null,
    valorPromocional: null,
    stock: null,
    imgProduct: ''
});

const options = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true }
];
const promo = ref(options[0]);

const replaceValor = (param) => {
    if (typeof param != 'string') {
        return param.toFixed(2).replace('.', ',')
    }
    return param.replace(',', '.');
}


function limparModal() {
    product.value = {
        nomeProduto: '',
        descricaoProduto: '',
        valor: null,
        valorPromocional: null,
        stock: null,
        imgProduct: ''
    }
    promo.value = options[0];
}

async function salvar() {
    let success = false;
    let message = ''
    try {
        const object = {
            valor: Number(replaceValor(product.value.valor)),
            valorPromocional: promo.value.value == true ? Number(replaceValor(product.value.valorPromocional)) : null,
            nomeProduto: product.value.nomeProduto,
            descricaoProduto: product.value.descricaoProduto,
            quantidade: 0, // usado no CART, aqui é apenas inicializada
            stock:  Number(product.value.stock),
            imgProduct: product.value.imgProduct
        }
        const response = await api.post('/products', object);
        message = response.data.message;
        success = true;
        limparModal();
    } catch (error) {
        success = false;
        error.response ? message = error.response.data.message : message = 'Erro ao salvar produto';
        product.value.stock = null
    } finally {
        success ? mostrarNotificacao('success', message) : mostrarNotificacao('error', message);
        if(success) emit('fetchData')
        closeModal()
    }
}

async function editar(){
    let success = false;
    let message = ''
    try {
        const object = {
            _id: handleEdit.value._id,
            valor: Number(replaceValor(product.value.valor)),
            valorPromocional: promo.value.value == true ? Number(replaceValor(product.value.valorPromocional)) : null,
            nomeProduto: product.value.nomeProduto,
            descricaoProduto: product.value.descricaoProduto,
            quantidade: 0, // usado no CART, aqui é apenas inicializada
            stock:  Number(product.value.stock),
            imgProduct: product.value.imgProduct
        }
        const response = await api.put('/products/', object);
        message = response.data.message;
        success = true;
        limparModal();
    } catch (error) {
        success = false;
        error.response ? message = error.response.data.message : message = 'Erro ao editar produto';
        product.value.stock = null
    } finally {
        success ? mostrarNotificacao('success', message) : mostrarNotificacao('error', message);
        if(success) emit('fetchData')
        closeModal()
    }

}

function closeModal() {
  const btn = document.getElementById('btn-cancelar-modal-admin')
  btn.click();
}

function mostrarNotificacao(type, message) {
    $q.notify({
        message: message,
        position: 'top',
        color: type === 'success' ? 'positive' : 'negative',
        icon: type === 'success' ? 'check' : 'warning'
    });
}
const handleEdit = ref(null)

const checkSave = () => {
        if(product.value.nomeProduto === '' || product.value.descricaoProduto === '' || product.value.valor === null || Number(replaceValor(product.value.valor)) == 0
        || product.value.stock === null || product.value.imgProduct === '') {
        return true;
    } else if (promo.value.value === true && product.value.valorPromocional === null || promo.value.value === true && Number(replaceValor(product.value.valorPromocional)) == 0  ||
                promo.value.value === true &&(Number(replaceValor(product.value.valorPromocional)) >= Number(replaceValor(product.value.valor)))) {
                    return true;
    } 
    return false
}
onBeforeMount(() => {
    if(props.editObject) {
        product.value = props.editObject;
        product.value.valor = replaceValor(props.editObject.valor);
        product.value.valorPromocional = product.value.valorPromocional ? replaceValor(props.editObject.valorPromocional) : null;
        handleEdit.value = product.value
        if(props.editObject.valorPromocional == '-') {
            promo.value = options[0];
        } else {
          promo.value = options[1];
        }
    }
})

</script>
<style scoped>
h5{
    margin: 0;
    padding: 0;
}
.q-btn{
    width: 100px;
}
.q-card{
    width: 500px;
}
</style>
