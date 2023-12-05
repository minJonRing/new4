const state = {
  goods: [],
  goodIds: []
}

const mutations = {
  // 存储商品数据
  SET_GOODS: (state, { handle, data, num }) => {
    // 已存在的商品数据 和 该商品id的数组
    const { goods, goodIds } = state;
    const _goods = JSON.parse(JSON.stringify(goods))
    const { id } = data || {};
    // 获取改商品的索引值
    const index = goodIds.indexOf(id)
    switch (handle) {
      // 动作是 添加是
      case 'add':
        // 判断新加的商品在不在数据里 存在数量加1  不存在数据加1
        if (index !== -1) {
          _goods[index].num += 1
          state.goods = _goods
        } else {
          _goods.push({ goods: data, num: 1 })
          state.goods = _goods
          state.goodIds = [...goodIds, id]
        }
        break;
      //删除商品
      case 'reduce':
        _goods.splice(index, 1)
        const _goodsIds = [...goodIds]
        _goodsIds.splice(index, 1)
        state.goods = _goods
        state.goodIds = _goodsIds
        break
      // 改变商品数量
      case 'change':
        _goods[index].num = num;
        state.goods = _goods
        break
      // 清空商品
      default:
        state.goods = []
        state.goodIds = []
        break
    }

  },
}

const actions = {
  // 设置商品
  setGoods({ commit }, data) {
    commit('SET_GOODS', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
