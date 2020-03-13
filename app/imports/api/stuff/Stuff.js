import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import ICAL from 'ical.js'
import swal from 'sweetalert'
import fs from 'file-saver'

/** Define a Mongo collection to hold the data. */
const Stuffs = new Mongo.Collection('Stuffs');

/** Define a schema to specify the structure of each document in the collection. */
const StuffSchema = new SimpleSchema({
  title: String,
  description: String,
  location: String,
  startDate: Date,
    endDate: {
        type: Date,
    },
}, { tracker: Tracker });

/** Takes in the data submitted then parses an iCalendar file to be downloaded */
let add = function (data) {

  const { title, description, location, startDate, endDate } = data;
  /**
   * ==============================
   * TO MAKE THE EVENT "ALL DAY"
   * MUST IMPLEMENT AT WAY TO ADD
   * ";VALUE=DATE" NEXT TO DTSTART:
   * AND DTEND: 
   * ==============================
   */
  var iCalendarData = [
    `BEGIN:VCALENDAR`,
    `CALSCALE:GREGORIAN`,
    `PRODID:-//University of Hawaii at Manoa.//ICS 414//EN`,
    `VERSION:2.0`,
    `NAME:${title}`,
    `BEGIN:VEVENT`,
    `DTSTAMP:20200228T232000Z`,
    `DTSTART:${dateFormatter(startDate, true)}`,
    `DTEND:${dateFormatter(endDate, true)}`,
    `GEO:40.0095;105.2669`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `UID:4088E990AD89CB3DBB484909`,
    `END:VEVENT`,
    `END:VCALENDAR`
  ].join("\r\n");

  var jcalData = ICAL.parse(iCalendarData);
  var vcalendar = new ICAL.Component(jcalData);
  
  download(vcalendar);
}

/** Allows the file to be downloaded */
let download = function(file) {
  const blob = new Blob([file], {type: 'text/plain:charset=utf-8'});
  fs.saveAs(blob, 'event.ics');
}

let dateFormatter = function (date, format) {
  // let options = {
  //   year: 'numeric', month: 'numeric', day: 'numeric',
  //   hour: 'numeric', minute: 'numeric', second: 'numeric',
  //   hour12: true, timeZone: 'Pacific/Honolulu'
  // };
  // options.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  let d = new Date(date);
  if (d.getHours > 13) {
    d.setHours(d.getHours() - 14);
  } else {
    d.setHours(d.getHours() + 10);
  }

  // let formt = new Intl.DateTimeFormat('en-US', options).format(d)
  if (format) {
    return regexFormat(d);
  } else {
    return d
  }
  
}

/** 
 * Handles the regex formatting of dates
 * taken from stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
 */
let regexFormat = function (date) {
  let d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();
  let hours = '' + d.getHours();
  let minutes = '' + d.getMinutes();
  let seconds = '' + d.getSeconds();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  if (hours.length < 2) {
    hours = '0' + hours;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }

  return [year, month, day, 'T', hours, minutes, seconds].join('');

}


/** Attach this schema to the collection. */
Stuffs.attachSchema(StuffSchema);

/** Make the collection and schema available to other code. */
export { add, dateFormatter, Stuffs, StuffSchema };
