<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h2>Say to AI</h2>
      <textarea v-model="content" placeholder="Enter your message here"></textarea>
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('submit', this.content);
      this.content = '';
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
  background: #1C0C2B; /* 深紫色背景 */
  color: #FFFFFF;
  padding: 20px;
  border-radius: 15px; /* 较大的圆角 */
  text-align: center;
  width: 400px; /* 定义宽度以适应内容 */
}

textarea {
  width: 90%; /* 宽度调整 */
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #A369F0; /* 浅紫色边框 */
  border-radius: 10px; /* 圆角设计 */
  background: #2A125A; /* 输入框使用略浅的深紫色背景 */
  color: #FFFFFF; /* 输入框内文字为白色 */
  resize: vertical; /* 允许垂直拖动 */
  min-height: 100px; /* 最小高度 */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 10px; /* 圆角按钮 */
  background-color: #A369F0; /* 浅紫色背景 */
  color: #FFFFFF; /* 白色文字 */
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%; /* 按钮宽度调整 */
}

button:hover {
  background-color: #5A82C5; /* 鼠标悬停时变为浅蓝色 */
}

.close-button {
  color: #FFFFFF;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #A369F0; /* 修改关闭按钮鼠标悬停和聚焦时的颜色为浅紫色 */
}
</style>
