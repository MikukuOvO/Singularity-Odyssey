<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import timeGridPlugin from '@fullcalendar/timegrid/index.js'
import interactionPlugin from '@fullcalendar/interaction/index.js'
import EventTitlePrompt from './components/EventTitlePrompt.vue'
import EventDetails from "./components/EventDetails.vue";

// 假设 INITIAL_EVENTS 由后端提供，这里不再需要
// import { INITIAL_EVENTS, createEventId } from './event-utils'
import axios from 'axios' // 引入axios

export default defineComponent({
  components: {
    FullCalendar,
    EventTitlePrompt,
    EventDetails,
  },
  data() {
    return {
      showPrompt: false,
      selectedEvent: null,
      showEventDetails: false,

      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'Back prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        customButtons: {
          Back:{
            text: 'Back',
            click: this.handleBack
          }
        },
        initialView: 'dayGridMonth',
        initialEvents: [], // 初始化为空，将通过API获取
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
      },
      currentEvents: [],
    }
  },
  created() {
    this.fetchEvents(); // 组件创建时获取事件数据
  },
  methods: {
    // 从后台调取事件
    fetchEvents() {
      axios.get('http://127.0.0.1:5000/api/events')
        .then(response => {
          const events = response.data.map(event => ({
            id: event.id, // 确保设置了id属性
            title: event.title,
            start: event.start,
            end: event.end,
            destination: event.destination,
          }));
          this.calendarOptions.events = events;
        })
        .catch(error => {
          console.error("There was an error fetching the events:", error);
        });
    },
    // 是否显示周末
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends
    },
    handleDateSelect(selectInfo) {
      this.showPrompt = true; // 显示模态
      this.selectInfo = selectInfo; // 保存 selectInfo 以备后用
    },
    handleSubmit(eventDetails) {
      // 使用传回的 title 和 destination 以及保存的 selectInfo 来进行操作
      axios.post('http://127.0.0.1:5000/api/events', {
        title: eventDetails.title,
        start: this.selectInfo.startStr,
        end: this.selectInfo.endStr,
        destination: eventDetails.destination, // 使用传入的目的地字段
      })
      .then(() => {
        this.fetchEvents();
      })
      .catch(error => {
        console.error('There was an error adding the event:', error);
      });

      this.showPrompt = false; // 关闭模态
    },
    // In the parent component's methods section
    deleteEvent(event) {
      axios.delete(`http://127.0.0.1:5000/api/events/${event.id}`)
        .then(() => {
          this.fetchEvents(); // Refresh the list of events
        })
        .catch(error => {
          console.error('There was an error deleting the event:', error);
        });
    },
    handleEventClick(clickInfo) {
      this.selectedEvent = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: this.formatEventTime(clickInfo.event.start),
        end: this.formatEventTime(clickInfo.event.end),
        destination: clickInfo.event.extendedProps.destination,
      };
      this.showEventDetails = true;
      console.log(this.selectedEvent);
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    updateEvent(event) {
      axios.put(`http://127.0.0.1:5000/api/events/${event.id}`, event)
      .then(() => {
        this.fetchEvents(); // Refresh events after update
      })
      .catch(error => {
        console.error('There was an error updating the event:', error);
      });
    },

    formatEventTime(timeStr) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      const date = new Date(timeStr);
      const dateTimeFormat = new Intl.DateTimeFormat('zh-CN', options);
      const [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(date);

      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    openAI() {
      const content = prompt("Say to AI:");
      if(content != null) {
        this.submitAI({content});
      }
    },
    submitAI(content) {
      axios.post('http://127.0.0.1:5000/api/interact', {
        content: content,
      })
      .then(() => {
        this.fetchEvents();
      })
      .catch(error => {
        console.error('There was an error when interact:', error);
      });
    },
    handleBack(){
      window.location.href = 'http://192.168.0.136:3000';
    }
  }
})
</script>

<template>
  <div class='demo-app'>
    <event-title-prompt v-if="showPrompt" @close="showPrompt = false" @submit="handleSubmit" />
    <event-details v-if="showEventDetails" :event="selectedEvent"
       @close="showEventDetails = false"
       @update-event="updateEvent"
       @delete-event="deleteEvent" />
    <div class='demo-app-sidebar'>
      <div class='demo-app-sidebar-section'>

        <h2>Singularity Odyssey</h2>
        <button class="add-event-button" @click="openAI"></button>
        <h5>Singularity Odyssey AI</h5>
      </div>
      <div class='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            :checked='calendarOptions.weekends'
            @change='handleWeekendsToggle'
          />
          toggle weekends
        </label>
      </div>
      <div class='demo-app-sidebar-section'>
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for="event in currentEvents" :key="event.id" class="event-item">
            <div class="event-title"><b>{{ event.title }}</b></div>
            <div class="event-time">
              {{ formatEventTime(event.startStr) }} ~ {{ formatEventTime(event.endStr) }}
            </div>
            <div class="event-destination">
              {{ event.extendedProps.destination }}
            </div>
          </li>

        </ul>
      </div>
    </div>
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent="arg">
          <div class="calendar-event-content">
            <span class="calendar-event-time">{{ arg.timeText }}</span>
            <span class="calendar-event-title">{{ arg.event.title }}</span>
            <div class="calendar-event-destination">{{ arg.event.extendedProps.destination }}</div>
          </div>
        </template>

      </FullCalendar>
    </div>
  </div>
</template>

<style lang='css'>
body, html {
  margin: 0;
  padding: 0;
  background: #121212; /* 假设logo背景是深色，这里使用深灰作为页面背景 */
  color: #E0E0E0; /* 浅灰色文字，保证在深色背景上的可读性 */
  font-family: 'Roboto', sans-serif; /* 现代简洁的字体 */
}

h2 {
  margin: 0 0 1em 0;
  font-size: 20px;
  color: #4ba3ff; /* 假设logo中有亮蓝色元素，用作标题颜色 */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
  padding: 0.5em;
  background: #1A1A1A; /* 深色列表项背景，略亮于页面背景 */
  border-radius: 5px;
  color: #E0E0E0; /* 浅灰色文字 */
}

b { /* 事件日期/时间 */
  font-weight: normal;
  color: #FFD700; /* 假设logo中有金色元素，用作重要文字颜色 */
}

/* 应用布局 */
.demo-app {
  display: flex;
  min-height: 100vh;
}

.demo-app-sidebar {
  width: 300px;
  background: #1A1A1A; /* 侧边栏深色背景 */
  border-right: 2px solid #4ba3ff; /* 亮蓝色边框，假设与logo颜色匹配 */
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
  background: #121212; /* 主内容区深色背景 */
}

/* 日历头部、按钮和事件样式，根据需要调整 */

.event-item {
  margin-bottom: 10px; /* 每个事件项之间增加间距 */
  padding: 10px; /* 增加内边距 */
  background: #2a2a2a; /* 深色背景 */
  border-radius: 8px; /* 圆角边框 */
  color: #E0E0E0; /* 浅灰色文字 */
}

.event-title b {
  color: #FFD700; /* 金色标题 */
  font-size: 1.2em; /* 较大的字体大小 */
}

.event-time {
  color: #C0C0C0; /* 次级信息使用更淡的颜色 */
  font-size: 0.9em; /* 较小的字体大小 */
  margin-top: 5px; /* 与标题之间增加一些间隔 */
}

.event-destination {
  color: #4ba3ff; /* 使用亮蓝色显示目的地 */
  font-size: 0.9em; /* 与时间相同的字体大小 */
  margin-top: 5px; /* 与时间之间增加一些间隔 */
}

/* 日历事件样式调整 */
.calendar-event-content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 确保垂直居中 */
  align-items: center; /* 确保水平居中 */
  padding: 10px; /* 增加内边距 */
  background-color: rgba(0, 0, 0, 0.7); /* 设置一个较深的半透明背景 */
  color: white; /* 设置字体颜色为白色 */
  border-radius: 5px; /* 边框圆角 */
  font-size: 1.2em; /* 增加字体大小 */
  line-height: 1.3; /* 增加行高 */
}

.calendar-event-time {
  font-size: 0.8em; /* 时间的字体略小于标题 */
  color: #FFD700; /* 金色，突出显示时间 */
  margin-bottom: 5px; /* 与标题之间的间距 */
}

.calendar-event-title {
  font-weight: 600; /* 字体加粗 */
  margin-bottom: 5px; /* 与目的地之间的间距 */
}

.calendar-event-destination {
  font-size: 0.7em; /* 目的地的字体最小 */
  color: #4ba3ff; /* 亮蓝色，标示目的地 */
}

.fc-event {
  background-color: black;
}

.add-event-button {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Make it circular */
  background-color: #4ba3ff; /* Button color */
  color: white; /* Text color */
  font-size: 24px; /* Text size */
  border: none; /* Remove border */
  cursor: pointer; /* Show pointer on hover */
}

.add-event-button:hover {
  background-color: #3578e5; /* Darker color on hover */
}

.add-event-button {
    background-image: url('../logo.png'); /* 设置背景图片 */
    background-size: cover;
    background-position: center;
    width: 50px; /* Adjust based on your image */
    height: 50px; /* Adjust based on your image */
    border: none;
    cursor: pointer;
    transition: transform 0.5s ease; /* Smooth transition for rotation */
}

.add-event-button:hover {
    transform: rotate(360deg); /* Rotate 360 degrees on hover */
}


</style>
