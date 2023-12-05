<template>
  <div class="block">
    <el-statistic>
      <template slot="formatter">
        <i class="price el-icon-coin" style="color:#ff4949">{{ price }}元</i>
      </template>
    </el-statistic>
  </div>
</template>

<script>
import { ajax } from '@/api/ajax'
export default {
  data() {
    return {
      price: 0
    }
  },
  created() {
    ajax({
      url: '/orders/amount'
    }).then(({ data }) => {
      const { amount } = data;
      this.price = amount
    })
  }
}
</script>
