<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h2>Edit Event Details</h2>
      <form class="form-container">
        <div class="form-group">
          <label for="title">Title:</label>
          <input id="title" type="text" v-model="editableEvent.title" placeholder="Event title">
        </div>
        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input id="startDate" type="date" v-model="editableEvent.startDate" placeholder="Start date">
        </div>
        <div class="form-group">
          <label for="startTime">Start Time:</label>
          <input id="startTime" type="time" v-model="editableEvent.startTime" placeholder="Start time" step="60">
        </div>
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input id="endDate" type="date" v-model="editableEvent.endDate" placeholder="End date">
        </div>
        <div class="form-group">
          <label for="endTime">End Time:</label>
          <input id="endTime" type="time" v-model="editableEvent.endTime" placeholder="End time" step="60">
        </div>
        <div class="form-group">
          <label for="destination">Destination:</label>
          <input id="destination" type="text" v-model="editableEvent.destination" placeholder="Destination">
        </div>
        <div class="form-group actions">
          <button type="button" @click="submit">Save Changes</button>
          <button type="button" class="delete-button" @click="deleteEvent">Delete Event</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['event'],
  data() {
    return {
      editableEvent: null
    };
  },
  created() {
    this.initializeEditableEvent();
  },
  methods: {
    initializeEditableEvent() {
      this.editableEvent = {
        ...this.event,
        startDate: this.formatDate(this.event.start),
        startTime: this.formatTime(this.event.start),
        endDate: this.formatDate(this.event.end),
        endTime: this.formatTime(this.event.end)
      };
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    },
    formatTime(dateStr) {
      const date = new Date(dateStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    close() {
      this.$emit('close');
    },
    submit() {
      const eventToSubmit = {
        ...this.editableEvent,
        start: new Date(`${this.editableEvent.startDate}T${this.editableEvent.startTime}`).toISOString(),
        end: new Date(`${this.editableEvent.endDate}T${this.editableEvent.endTime}`).toISOString()
      };
      this.$emit('update-event', eventToSubmit);
      this.close();
    },
    deleteEvent() {
      if (confirm("Are you sure you want to delete this event?")) {
        this.$emit('delete-event', this.editableEvent);
        this.close();
      }
    }
  }
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
  background: #1C0C2B;
  color: #FFFFFF;
  padding: 20px;
  border-radius: 20px; /* 更明显的圆角 */
  width: 500px;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  flex: 0 30%;
  text-align: right;
  margin-right: 10px;
}

input[type="text"], input[type="date"], input[type="time"] {
  flex: 1;
  padding: 8px;
  background: #2A125A;
  color: #FFFFFF;
  border: 2px solid #A369F0;
  border-radius: 15px; /* 圆角矩形风格 */
}

button, .delete-button {
  padding: 10px 20px;
  border: none;
  border-radius: 15px; /* 圆角矩形风格 */
  background-color: #A369F0;
  color: #FFFFFF;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;
}

button:hover, .delete-button:hover {
  background-color: #5A82C5;
}

.close-button {
  color: #FFFFFF;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover {
  color: #A369F0;
}

.delete-button {
  background-color: #FF6347;
}

.delete-button:hover {
  background-color: #E52F1B;
}

.actions {
  display: flex;
  gap: 10px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
