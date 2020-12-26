/*Create variables*/
var scheduleArr = [];
var scheduleObj = {};
var dateArr = [];
var dateObj = {};
var storedSchedule;
var savedSchedule;
var date = moment().format('LL');
previous = 0;
next = 0;
day = 0;

/*Create a function to execute when the DOM is fully loaded*/
$(document).ready(function() {
  page();

  function page() {
    storecurrentDate();
    adjustDay();
    adjustTime();
    displaySchedule();
    currentSchedule();
    saveEvent();
    clearSchedule();
  }
  /*Create a function to store the dates within localStorage*/
  function storecurrentDate() {
    savedSchedule = JSON.parse(localStorage.getItem(date));

    if (savedSchedule === null) {
      console.log('creating');
      dateObj['date'] = date;
      dateArr.push(dateObj);
      localStorage.setItem(date, JSON.stringify(dateArr));
    }
  }

  function storeDifferentDate() {
    var existingStorage = JSON.parse(localStorage.getItem(date));

    if (existingStorage !== null) {
      scheduleArr = existingStorage;
    } else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj['date'] = date;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(date, JSON.stringify(currentDateArr));
    }
  }
  /*Create a function to display the current date*/
  function adjustTime(differentDate) {
    if (differentDate !== date) {
      var currentDate = moment().format('dddd, MMMM Do');
      var currentYear = moment().format('YYYY');
      $('#title-date').html(currentDate);
      $('#title-year').html(currentYear);
      dynamicTime();
    }
    /*Create an if-else statement to display the previous, current, or future schedule*/
    if (day < 0) {
      $('#title-date').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looked like for this day.'
      );
      $('#dynamic-time').hide();

      var dayOfYear = moment().dayOfYear();
      if (dayOfYear + day === 0) {
        currentYear = previousDate.format('YYYY');
        $('#title-year').html(currentYear);
      }
    } else if (day > 0) {
      currentYear = nextDate.format('YYYY');
      $('#title-date').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looks like for this day so far.'
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').hide();
    } else {
      currentYear = moment().format('YYYY');
      $('#title-time').html(
        'Here is your schedule for today. The current time is: '
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').show();
      dynamicTime();
    }
  }
  /*Create a function to display the current time*/
  function dynamicTime() {
    var currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }
  /*Create a function to color-code time-blocks based on page links (past, current, future schedules)*/
  function currentSchedule() {
    var currentHourInt = parseInt(moment().format('HH'));

    var timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', 'grey');
    } else if (day > 0) {
      $('.input-area').css('background-color', '#00BFFF');
    } else {
      for (var i = 0; i < timeIDs.length; i++) {
        var timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'grey');
        } else if (timeIDsInt === currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'lightblue');
        } else {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#00BFFF');
        }
      }
    }
  }
  /*Create a function to clear the schedule & remove user input from localStorage*/
  function clearSchedule() {
    $('#clear-button').on('click', function() {
      scheduleObj = {};
      scheduleArr.length = 0;
      scheduleObj['date'] = date;
      scheduleArr.push(scheduleObj);

      localStorage.removeItem(date);
      $('.input-area').val('');

      localStorage.setItem(date, JSON.stringify(scheduleArr));
    });
  }
  /*Create a function to save the schedule & store user input into localStorage*/
  function displaySchedule() {
    savedSchedule = JSON.parse(localStorage.getItem(date));
    $('.input-area').val('');
    for (var i = 0; i < savedSchedule.length; i++) {
      var getKey = Object.keys(savedSchedule[i]);
      var getValue = Object.values(savedSchedule[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }
  /*Create an on click function for the page links*/
  function adjustDay() {
    $('nav').on('click', function(e) {
      var dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        previousDate = moment().add(day, 'days');
        date = previousDate.format('LL');
        storeDifferentDate();
        adjustTime(previousDate.format('dddd, MMMM Do'));
        displaySchedule();
        currentSchedule();
        return date;
      } else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        date = nextDate.format('LL');
        storeDifferentDate();
        adjustTime(nextDate.format('dddd, MMMM Do'));
        displaySchedule();
        currentSchedule();
        return date;
      } else {
        day = 0;
        dayButtonID = 'current-day';
        changeActive(dayButtonID);

        date = moment().format('LL');
        $('.input-area').val('');
        adjustTime();
        displaySchedule();
        currentSchedule();
        return date;
      }
    });
  }
  /*Create a function to load a new page using the on click function*/
  function changeActive(page) {
    var activeClass = $('#change-div>nav>ul>li.active');

    scheduleArr.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }
  /*Create an on click function to save user input into the text area*/
  function saveEvent() {
    $('.save-button').on('click', function() {
      var trId = $(this)
        .closest('tr')
        .attr('id');
      var textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      storedSchedule = JSON.parse(localStorage.getItem(date));
      scheduleObj = {};

      scheduleObj[trId] = textAreaVal;
      scheduleArr.push(scheduleObj);
      localStorage.setItem(date, JSON.stringify(scheduleArr));

      for (var i = 0; i < storedSchedule.length; i++) {
        if (storedSchedule[i].hasOwnProperty(trId)) {
          storedSchedule[i][trId] = textAreaVal;
          scheduleArr = storedSchedule;
          localStorage.setItem(date, JSON.stringify(scheduleArr));
          return;
        }
      }
    });
  }
});