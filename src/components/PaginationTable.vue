<template>
    <div id="pagination-wrapper" class="w100 row items-center no-wrap justify-end bg-primary">
        <div class="bg-white q-py-sm q-px-md q-mr-md rounded-borders">
            <q-tooltip>
                Página Atual / Total de Páginas
            </q-tooltip>
            {{ pagination.page }} / {{ pagination.totalPages }}
        </div>
        <div class="pagination row no-wrap items-center q-gutter-x-xs">
            <q-btn :disabled="pagination.page == 1" dense @click="paginationAction('first_page')">
                <q-icon color="white" size="md" name="first_page">
                    <q-tooltip>
                        Primeira Página
                    </q-tooltip>
                </q-icon>
            </q-btn>
            <q-btn dense  :disabled="pagination.page == 1"  @click="paginationAction('prev_page')">
                <q-icon color="white" size="md" name="chevron_left">
                    <q-tooltip>
                        Página Anterior
                    </q-tooltip>
                </q-icon>
            </q-btn>
            <q-select class="bg-white q-ml-xs" filled dense v-model="itemsPerPage" @update:model-value="paginationAction('rowsPerPage')" :options="itemsPerPageOptions">
                <q-tooltip>
                    Itens por Página
                </q-tooltip>
            </q-select>
            <q-btn :disabled="pagination.isLastPage" dense @click="paginationAction('next_page')">
                <q-icon :disabled="pagination.isLastPage" color="white" size="md" name="chevron_right">
                    <q-tooltip>
                        Próxima Página
                    </q-tooltip>
                </q-icon>
            </q-btn>
            <q-btn dense  :disabled="pagination.isLastPage" class="q-mr-sm"  @click="paginationAction('last_page')">
                <q-icon color="white" size="md" name="last_page">
                    <q-tooltip>
                        Última Página
                    </q-tooltip>
                </q-icon>
            </q-btn>
        </div>
        <div class="bg-white q-py-sm q-px-md q-mr-md rounded-borders">
            <q-tooltip>
                Total de Items
            </q-tooltip>
            {{ pagination.rowsPerPage >= pagination.totalElements ? pagination.totalElements : pagination.rowsPerPage}} de {{ pagination.totalElements }}
        </div>
    </div>
</template>


<script setup >
import { defineProps, defineEmits, ref } from 'vue';
const emit = defineEmits(['fetchData']);
const props = defineProps({
    pagination: Object
});
const itemsPerPageOptions = ref([5, 10, 20, 35, 50])
const itemsPerPage = ref(itemsPerPageOptions.value[1])

const paginationAction = (action) => {
    switch (action) {
        case 'first_page':
            props.pagination.page = 1
            emit('fetchData')
            break
        case 'prev_page':
            props.pagination.page--
            emit('fetchData')
            break
        case 'next_page':
            props.pagination.page++
            emit('fetchData')
            break
        case 'last_page':
            props.pagination.page = props.pagination.totalPages
            emit('fetchData')
            break
        case 'rowsPerPage':
            if(itemsPerPage.value > props.pagination.totalElements) {
                itemsPerPage.value = props.pagination.totalElements
            }
            props.pagination.rowsPerPage = itemsPerPage.value
            emit('fetchData')
            break
    }
}

</script>

<style scoped>
#pagination-wrapper {
    height: 46px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.q-select {
    border-radius: 4px;
}
</style>