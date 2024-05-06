<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h2>Edit Event Details</h2>

      <label for="title">Title:</label>
      <input id="title" type="text" v-model="editableEvent.title" placeholder="Event title">

      <label for="startDate">Start Date:</label>
      <input id="startDate" type="date" v-model="editableEvent.startDate" placeholder="Start date">

      <label for="startTime">Start Time:</label>
      <input id="startTime" type="time" v-model="editableEvent.startTime" placeholder="Start time" step="60">

      <label for="endDate">End Date:</label>
      <input id="endDate" type="date" v-model="editableEvent.endDate" placeholder="End date">

      <label for="endTime">End Time:</label>
      <input id="endTime" type="time" v-model="editableEvent.endTime" placeholder="End time" step="60">

      <label for="destination">Destination:</label>
      <input id="destination" type="text" v-model="editableEvent.destination" placeholder="Destination">

      <button @click="submit">Save Changes</button>
      <button class="delete-button" @click="deleteEvent">Delete Event</button>
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
      // Split the date and time
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
      console.log(date)
      return date.toISOString().split('T')[0];  // Correctly splits at 'T', taking the date part
    },
    formatTime(dateStr) {
      const date = new Date(dateStr);
      // Format to HH:mm based on local time
      const hours = date.getHours().toString().padStart(2, '0'); // Ensures two digits
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two digits
      console.log(`${hours}:${minutes}`);  // Log to ensure the correctness
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
  background: #000; /* Black background */
  color: #fff; /* White text */
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

input[type="text"], input[type="date"] {
  width: 90%;
  padding: 8px;
  margin-top: 10px;
  background: #333; /* Dark background for inputs */
  color: #fff; /* Light text */
  border: none;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #ffd700; /* Gold background */
  color: #000; /* Black text */
  cursor: pointer;
  font-weight: bold; /* Bold text */
  transition: background-color 0.3s; /* Smooth background color transition */
  margin-top: 20px;
}

button:hover {
  background-color: #e6c300; /* Darker gold when hovered */
}

.close-button {
  color: #fff; /* White color */
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #e6c300; /* Gold color on hover/focus */
}
.delete-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #ff6347; /* Tomato red background for delete button */
  color: #fff; /* White text */
  cursor: pointer;
  font-weight: bold; /* Bold text */
  transition: background-color 0.3s; /* Smooth background color transition */
  margin-top: 10px;
}

.delete-button:hover {
  background-color: #e52f1b; /* Darker red when hovered */
}
</style>
