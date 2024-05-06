<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h2>Enter event details</h2>
      <input type="text" v-model="eventTitle" placeholder="Event title">
      <input type="text" v-model="destination" placeholder="Destination">
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventTitle: '',
      destination: '',  // 新增数据属性
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('submit', { title: this.eventTitle, destination: this.destination });
      this.eventTitle = '';
      this.destination = ''; // 重置输入
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #000; /* 黑色背景 */
  color: #fff; /* 白色文字 */
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

input[type="text"] {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd; /* 边框颜色可能需要调整以保持可见性 */
  border-radius: 5px;
  background: #333; /* 深色输入框背景 */
  color: #fff; /* 输入框内文字为白色 */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #ffd700; /* 金色背景 */
  color: #000; /* 按钮文字为黑色 */
  cursor: pointer;
  font-weight: bold; /* 加粗文字 */
  transition: background-color 0.3s; /* 平滑背景色变化 */
}

button:hover {
  background-color: #e6c300; /* 鼠标悬停时的颜色变为深一点的金色 */
}

.close-button {
  color: #fff; /* 修改关闭按钮颜色为白色 */
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #e6c300; /* 修改关闭按钮鼠标悬停和聚焦时的颜色为金色 */
}

</style>
