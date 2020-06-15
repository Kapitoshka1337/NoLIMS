<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/equipment/plan.js');
?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.min.js"></script>
<div class="column">
  <div class="calendar">
    <div class="title">
      <div class="month">
        {{monthName}}
      </div>
      <div class="year">
        {{year}}
      </div>
    </div>
    <ol class="days">
      <li class="day" v-for="day in days | orderBy 'unix' 1" v-bind:class="{ 'outside': day.outsideOfCurrentMonth, 'empty': day.events.length === 0 }">
        <div class="date">
          <span class="weekday">{{day.weekday}}</span>
          <span class="month">{{day.month}}</span>
          <span class="day">{{day.number}}</span>
          <span class="year">{{day.year}}</span>
        </div>
        <div class="events">
          <div v-for="event in day.events" class="event" v-bind:class="{'first': event.firstInRange, 'last': event.lastInRange }">{{event.title}} </div>
        </div>
      </li>
    </ol>
  </div>
</div>
<div class="column" id="app">
  <calendar></calendar>
</div>
<template id="calendar-template">
  <div class="calendar">
    <div class="title">
      <div class="month">
        {{monthName}}
      </div>
      <div class="year">
        {{year}}
      </div>
    </div>
    <ol class="days">
      <li class="day" v-for="day in days | orderBy 'unix' 1" v-bind:class="{ 'outside': day.outsideOfCurrentMonth, 'empty': day.events.length === 0 }">
        <div class="date">
          <span class="weekday">{{day.weekday}}</span>
          <span class="month">{{day.month}}</span>
          <span class="day">{{day.number}}</span>
          <span class="year">{{day.year}}</span>
        </div>
        <div class="events">
          <div v-for="event in day.events" class="event" v-bind:class="{'first': event.firstInRange, 'last': event.lastInRange }">{{event.title}} </div>
        </div>
      </li>
    </ol>
  </div>
</template>