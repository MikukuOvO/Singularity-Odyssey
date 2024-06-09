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
          <div class="calendar-event-content fc-event fc-event-main">
            <span class="calendar-event-time">{{ arg.timeText }}</span>
            <span class="calendar-event-title">{{ arg.event.title }}</span>
            <div class="calendar-event-destination">{{ arg.event.extendedProps.destination }}</div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import timeGridPlugin from '@fullcalendar/timegrid/index.js'
import interactionPlugin from '@fullcalendar/interaction/index.js'
import EventTitlePrompt from './components/EventTitlePrompt.vue'
import EventDetails from "./components/EventDetails.vue";
import SayToAI from './components/SayToAI.vue';
import axios from 'axios' // 引入axios

export default defineComponent({
  components: {
    FullCalendar,
    EventTitlePrompt,
    EventDetails,
    SayToAI,
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
          Back: {
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
      const [{ value: year }, , { value: month }, , { value: day }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(date);

      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    openAI() {
      const content = prompt("Say to AI:");
      if (content != null) {
        this.submitAI({ content });
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
    handleBack() {
      window.location.href = 'http://192.168.0.136:3000';
    }
  }
})
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  background: #1C0C2B; /* Deep purple background as the main theme color */
  color: #FFFFFF; /* White text for better readability on a dark background */
  font-family: 'Arial', serif; /* Using Arial for a modern look */
}

h2 {
  margin: 0 0 1em 0;
  font-size: 20px;
  color: #A369F0; /* Lilac for event titles */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
  padding: 0.5em;
  background: #2A437F; /* A darker blue shade for list items */
  border-radius: 10px; /* Rounded corners for design consistency */
  color: #FFFFFF; /* Maintaining white text for consistency */
}

b { /* Bold styling for key text */
  font-weight: normal;
  color: #A369F0; /* Lilac color for key text */
}

.demo-app-calendar {
  color: #FFFFFF; /* Lilac for event titles */
}

.demo-app-event {
  color: #FFFFFF; /* Lilac for event titles */
}
/* Application layout adjustments */
.demo-app {
  display: flex;
  min-height: 100vh;
}

.demo-app-sidebar {
  width: 300px;
  background: #302B63; /* Dark blue for sidebar */
  border-right: 2px solid #A369F0; /* Lilac border to tie in with the theme */
}

.demo-app-sidebar-section {
  padding: 2em;
  color: #FFFFFF; /* White text for readability */
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
  background: #1C0C2B; /* Continuing the deep purple background */
}

/* Calendar headers, buttons, and event styles adjusted for theme */
.event-item {
  margin-bottom: 10px; /* Spacing between events */
  padding: 10px; /* Padding for touchability */
  background: #2A125A; /* A deep purple for events */
  border-radius: 10px; /* Rounded corners */
  color: #FFFFFF; /* White text for readability */
}

.event-title b {
  color: #A369F0; /* Lilac for event titles */
  font-size: 1.2em; /* Larger font for emphasis */
}

.event-time {
  color: #C0C0C0; /* Lighter gray for secondary info */
  font-size: 0.9em; /* Smaller font for secondary info */
  margin-top: 5px; /* Spacing for clarity */
}

.event-destination {
  color: #A369F0; /* Lilac to highlight destinations */
  font-size: 0.9em; /* Consistent font size with time */
  margin-top: 5px; /* Additional spacing for layout */
}

/* Adjusting calendar event visuals */
.calendar-event-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #2C1A47; /* A deep purple for calendar events */
  color: #FFFFFF; /* White text for readability */
  border-radius: 10px; /* Rounded corners */
  font-size: 1em;
  line-height: 1.3;
}

.calendar-event-time {
  font-size: 0.8em;
  color: #C0C0C0; /* Lighter gray for secondary info */
  margin-bottom: 5px;
}

.calendar-event-title {
  font-weight: 600; /* Bold for importance */
  color: #A369F0; /* Lilac for event titles */
  margin-bottom: 5px;
}

.calendar-event-destination {
  font-size: 0.7em;
  color: #A369F0; /* Consistent lilac for destination */
}

.add-event-button {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Circular button for a modern look */
  background-color: #A369F0; /* Lilac to match the theme */
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
}

.add-event-button:hover {
  background-color: #5A82C5; /* A lighter blue on hover for interaction feedback */
}

.add-event-button {
  background-image: url('../logo.png'); /* Setting a background image */
  background-size: cover;
  background-position: center;
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  transition: transform 0.5s ease; /* Smooth transformation on hover */
}

.add-event-button:hover {
  transform: rotate(360deg); /* Rotating effect on hover for playful interaction */
}

</style>
