<template>
    <div class="page q-px-xl q-pt-lg">
        <q-btn class="q-mb-lg" color="primary" label="Voltar" @click="back"/>
        <q-banner class="rounded-borders q-py-md q-px-lg">
            <h5 class="text-primary-2">Consultar Produtos</h5>
            <div class="inputs-banner w100 row q-gutter-x-md q-mt-md">
                <q-input @keyup.enter="fetchData" style="width:20%" outlined type="text" label="Nome do Produto" v-model="nome"/>
                <q-input @keyup.enter="fetchData" style="width:10%" outlined prefix="R$" maxlength="8" mask="######,##" v-model="valorMax" reverse-fill-mask label="Valor Mínimo"/>
                <q-input @keyup.enter="fetchData" style="width:10%" outlined prefix="R$" maxlength="8" mask="######,##" v-model="valorMin" reverse-fill-mask label="Valor Máximo"/>
                <q-select @keyup.enter="fetchData" outlined v-model="promo" :options="options" label="Em promoção">
                    <template v-slot:append>
                        <q-icon name="close" @click.stop.prevent="promo = null" class="cursor-pointer" />
                    </template>
                </q-select>
                <q-select @keyup.enter="fetchData" outlined v-model="stock" :options="options" label="Em estoque">
                    <template v-slot:append>
                        <q-icon name="close" @click.stop.prevent="stock = null" class="cursor-pointer" />
                    </template>
                </q-select>
            </div>
            <div class="row q-gutter-x-md q-mt-md   q-pb-sm">
                <q-btn color="primary" icon="search" label="Consultar" @click="fetchData"/>
                <q-btn color="accent" icon="add" label="Adicionar" @click="toggleAdminCreateProductModal()"/>
                <q-btn icon="search_off" label="Limpar campos" @click="limparConsulta"/>
            </div>
        </q-banner>
        <q-banner class="rounded-borders q-mt-lg q-py-md q-px-lg">
        <h5 class="text-primary-2">Resultado da Consulta</h5>
        <div class="border">
            <q-table
            table-header-class="bg-primary text-white "
            class="q-mt-lg no-shadow "
            :rows="rows"
            :columns="columns"
            v-model:pagination="pagination"
            hide-pagination
            row-key="field"
        >
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-icon class="cursor-pointer" size="sm" color="yellow-9" name="edit" @click="editProduct(props.row.id)" />
                <q-icon class="cursor-pointer" size="sm" color="green-5" name="add_shopping_cart" @click="addStock(props.row.id)" />
                <q-icon class="cursor-pointer" size="sm" color="red-9" name="delete_forever" @click="deleteProduct(props.row.id)" />
            </q-td>
        </template>
        <template v-slot:body-cell-stock="props">
            <q-td :props="props" class="row  items-center">
                <q-icon class="q-pr-md" :color="props.row.stock ? 'green-5' : 'red-9'" :name="props.row.stock ? 'check_circle' : 'cancel'" />
                {{ props.row.stock ? 'Disponível (' + props.row.stock + ')' : 'Indisponível' }}
            </q-td>
        </template>
        </q-table>
        </div>
        <PaginationTable  @fetchData="fetchData" :pagination="pagination"/>
        </q-banner>
    <AdminCreateProductModal @fetchData="fetchData" v-if="adminCreateProductModal" @cancel="toggleAdminCreateProductModal"/>
    </div>
</template>
<script setup>
import { api } from "src/boot/axios";
import AdminCreateProductModal from "src/components/AdminCreateProductModal.vue";
import PaginationTable from "src/components/PaginationTable.vue";
import { onBeforeMount, ref } from "vue";
const adminCreateProductModal = ref(false);

const options = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
];
const promo = ref(null);
const stock = ref(null);
const nome = ref(null);
const valorMax = ref(null);
const valorMin = ref(null);
const columns = [
  { name: 'nomeProduto', label: 'Nome'.toUpperCase(), align: 'left', field: 'nomeProduto' },
  { name: 'valor', label: 'Valor Máximo'.toUpperCase(), align: 'left', field: 'valor', format: (val) => val ? `R$ ${val.toFixed(2).replace('.', ',')}` : '-' },
  { name: 'valorPromocional', label: 'Valor Promocional'.toUpperCase(), align: 'left', field: 'valorPromocional', format: (val) => val ? `R$ ${val.toFixed(2).replace('.', ',')}` : '-' },
  { name: 'stock', label: 'Estoque'.toUpperCase(), align: 'left', field: 'stock', format: (val) => val ? 'Disponível (' + val + ')' : 'Indisponível' },
  { name: 'actions', label: 'Ações'.toUpperCase(), align: 'right' }
];
const rows = ref([]);

const back = () => {
    window.location.href = '/';
}

const limparConsulta = async () => {
    nome.value = null;
    valorMax.value = null;
    valorMin.value = null;
    promo.value = null;
    stock.value = null;
    await fetchData();
}
const replaceValor = (param) =>  {
    // fazer classe util pra esse tipo de funcao
    return param.replace(',', '.');
}

function toggleAdminCreateProductModal () {
    adminCreateProductModal.value = !adminCreateProductModal.value;
}
const pagination = ref({
                    page: 1,
                    isLastPage: null,
                    rowsPerPage: 10,
                    totalElements: null,
                    totalPages: null
                })


const fetchData = async () => {
    try {
        const response = await api.get('/products', {
            params: {
                nome: nome.value,
                valorMax: valorMax.value ? Number(replaceValor(valorMax.value)) : null,
                valorMin: valorMin.value ? Number(replaceValor(valorMin.value)) : null,
                emPromocao: promo.value ? promo.value.value : null,
                stock: stock.value ? stock.value.value : null,
                page: pagination.value.page,
                rowsPerPage: pagination.value.rowsPerPage
            }
        });
        console.log(JSON.stringify(response.data.pagination)); 
        pagination.value.page = response.data.pagination.page;
        pagination.value.isLastPage = response.data.pagination.isLastPage;
        pagination.value.rowsPerPage = response.data.pagination.rowsPerPage;
        pagination.value.totalElements = response.data.pagination.totalElements;
        pagination.value.totalPages = response.data.pagination.totalPages
        rows.value = response.data.products;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function editProduct(productId) {
    // Lógica para editar o produto
}

function deleteProduct(productId) {
    // Lógica para remover o produto
}

function addStock(productId) {
    // Lógica para adicionar estoque ao produto
}

onBeforeMount(fetchData)

</script>
<style scoped>
h5{
    margin: 0;
    padding: 0;
}
.page {
    height: 100vh;
    width: 100vw;
    background-color: #c0d5d0;
}
.q-select {
    width: 15%;
}
</style>