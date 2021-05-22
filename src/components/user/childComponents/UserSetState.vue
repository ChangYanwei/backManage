<template>
  <div>
    <el-switch v-model="nowState" @change="userStateChange(userinfo)"></el-switch>
  </div>
</template>

<script>
  import {changUserStateRequest} from "network/user";

  export default {
    name: "UserSetState",
    props: {
      state: {
        type: Boolean,
        required: true
      },
      userinfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        nowState: this.state
      }
    },
    methods: {
      // switch状态改变
      userStateChange(userinfo) {
        changUserStateRequest(userinfo.id, this.nowState).then(res => {
          let result = res.data;
          console.log('修改状态', result);
          if (result.meta.status !== 200) {
            // 如果更新状态失败，要让已经改变的状态恢复成原样
            this.nowState = !this.nowState;
            return this.alertMessage('更新状态失败', 'error');
          }
          this.alertMessage('更新状态成功', 'success');
        })
      }
    }
  }
</script>

<style scoped>

</style>
