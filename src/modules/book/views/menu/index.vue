<template>
    <div class="menu">
        <Ts v-if="docType === 'ts'" :book="book" />
        <Bz v-if="docType === 'bz'" :book="book" />
        <Tp v-if="docType === 'tp'" :book="book" />
        <Da v-if="docType === 'da'" :book="book" />
        <Qk v-if="docType === 'qk'" :book="book" />
    </div>
</template>
  
<script>
import Ts from './ts.vue'
import Bz from './bz.vue'
import Tp from './tp.vue'
import Da from './da/index.vue'
import Qk from './qk/index.vue'
export default {
    name: "Menu",
    props: {
        book: {
            type: Object,
            default: () => ({ id: null })
        }
    },
    components: {
        Ts,
        Bz,
        Tp,
        Da,
        Qk
    },
    computed: {
        docType() {
            return this.book.docType
        }
    },
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    },
    methods: {


    }
};
</script>

<style lang="scss" scoepd>
.menu {
    width: 100%;
    height: 100%;
    padding-right: 10px;
}
</style>
  