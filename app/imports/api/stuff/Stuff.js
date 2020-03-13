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
  startDate: String,
  endDate: String,
}, { tracker: Tracker });

/** Takes in the data submitted then parses an iCalendar file to be downloaded */
let add = function (data) {

  const { title, description, location, startDate, endDate } = data;
  
  var iCalendarData = [
    `BEGIN:VCALENDAR`,
    `CALSCALE:GREGORIAN`,
    `PRODID:-//University of Hawaii at Manoa.//ICS 414//EN`,
    `VERSION:2.0`,
    `NAME:${title}`,
    `BEGIN:VEVENT`,
    `DTSTAMP:20200228T232000Z`,
    `DTSTART;VALUE=DATE:20201129`,
    `DTEND;VALUE=DATE:20201130`,
    `GEO:40.0095;105.2669`,
    `SUMMARY:${title}`,
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
  const blob = new Blob([file], {type: 'text/plain:charset=utf-8'})
  fs.saveAs(blob, 'event.ics');
}



/** Attach this schema to the collection. */
Stuffs.attachSchema(StuffSchema);

/** Make the collection and schema available to other code. */
export { add, Stuffs, StuffSchema };
