import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import ICAL from 'ical.js'
import swal from 'sweetalert'
import fs from 'file-saver'
import { getVTZ } from './Timezone'
import { object } from 'prop-types';

/** Define a Mongo collection to hold the data. */
const Stuffs = new Mongo.Collection('Stuffs');

/** Define the Timezones including DST */
let timezones = getVTZ(Intl.DateTimeFormat().resolvedOptions().timeZone);

/** Define a schema to specify the structure of each document in the collection. */
const StuffSchema = new SimpleSchema({
    title: String,
    description: String,
    location: String,
    geolocation: String,
    priority: String,
    //repeat: String,
    //repeatCount: Number,
    startDate: Date,
    endDate: Date,
}, { tracker: Tracker });

/** Takes in the data submitted then parses an iCalendar file to be downloaded */
let add = function (data) {

    const { 
        title, 
        description, 
        location, 
        geolocation, 
        priority,
        repeat,
        // repeatCount,
        startDate, 
        endDate, 
        classification,
        resources,
        rsvp,
        timezone
    } = data;

    console.log(resources);
    console.log(rsvp);
    console.log(attendee(rsvp));
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    console.log(timezone);
    console.log(geolocation);

    if (timezone && timezone.length) {
        timezones = getVTZ(timezone[0].id);
    }

    if (!timezones[1]) {
        timezones[1] = timezones[0];
    }

    var iCalendarData = [
        `BEGIN:VCALENDAR`,
        `CALSCALE:GREGORIAN`,
        `PRODID:-//University of Hawaii at Manoa.//ICS 414//EN`,
        `VERSION:2.0`,
        `NAME:${title}`,
        `BEGIN:VTIMEZONE`,
        `TZID:${timezones[0].TYPE}`,
        `BEGIN:STANDARD`,
        `DTSTART:${timezones[0].DTSTART}`,
        `TZOFFSETFROM:${timezones[0].TZOFFSETFROM}`,
        `TZOFFSETTO:${timezones[0].TZOFFSETTO}`,
        `TZNAME:${timezones[0].TZNAME}`,
        `END:STANDARD`,
        `BEGIN:DAYLIGHT`,
        `DTSTART:${timezones[1].DTSTART}`,
        `TZOFFSETFROM:${timezones[1].TZOFFSETFROM}`,
        `TZOFFSETTO:${timezones[1].TZOFFSETTO}`,
        `TZNAME:${timezones[1].TZNAME}`,
        `END:DAYLIGHT`,
        `END:VTIMEZONE`,
        `BEGIN:VEVENT`,
        `DTSTAMP:20200228T232000Z`,
        `DTSTART:${dateFormatter(startDate, true)}`,
        `DTEND:${dateFormatter(endDate, true)}`,
        `${recurrence(repeat)}`,
        `GEO:${printGeo(geolocation)}`,
        `SUMMARY:${title}`,
        `${optProp(`DESCRIPTION`, description, true)}`,             // description is optional
        `LOCATION:${location}`,
        `PRIORITY:${setPriority(priority)}`,
        `CLASS:${classification.toUpperCase()}`,
        `${optProp(`RESOURCES`, resources, false)}`,                // resources is optional
        `${attendee(rsvp)}`,
        `UID:4088E990AD89CB3DBB484909`,
        `END:VEVENT`,
        `END:VCALENDAR`
    ].filter(val => val !== 'undefined').join("\r\n");              // might use splice(~31, 0, func) to add RSVP

    console.log(iCalendarData);
    console.log(getVTZ(Intl.DateTimeFormat().resolvedOptions().timeZone));
    console.log(timezones[0].BEGIN);

    var jcalData = ICAL.parse(iCalendarData);
    var vcalendar = new ICAL.Component(jcalData);

    download(vcalendar);
}

/** Allows the file to be downloaded */
let download = function (file) {
    const blob = new Blob([file], { type: 'text/plain:charset=utf-8' });
    fs.saveAs(blob, 'event.ics');
}

/** Creates an attendee property if rsvp is used */
let attendee = function (rsvp) {
    if (rsvp === undefined || rsvp.length == 0) {
        return undefined;
    } else {
        let str = '';
        for (let i = 0; i < rsvp.length; i++) {
            str += `ATTENDEE;RSVP=TRUE:mailto:${rsvp[i].email}`
            if (i < rsvp.length - 1) {
                str += '\n';
            }
        }
        return str;
    }

}

// /** Allows custom timzones */
// let customTZ = function (timezone) {
//     if (timezone === undefined || timezone.length == 0) {
//         return '';
//     } else {
//         return `;TZID=${timezone[0].id}`
//     }
// }

/** Formats the date into an acceptable ical date format */
let dateFormatter = function (date, format) {
    let d = new Date(date);
    if (d.getHours > 13) {
        d.setHours(d.getHours() - 14);
    } else {
        d.setHours(d.getHours() + 10);
    }
    if (format) {
        return regexFormat(d);
    } else {
        return d
    }
}

/** Function for optional properties */
let optProp = function (property, value, include) {
    if (value === undefined || value === '') {
        if (include === true) {
            return `${property}:`;
        } else {
            return undefined;
        }
    } else {
        return `${property}:${value}`;
    }
}

/** Returns the recurrence string */
let recurrence = function (repeat) {
    if (repeat === undefined || repeat.length == 0) {
        return undefined;
    } else {
        let str = `RRULE:FREQ=${repeat[0].frequency.toUpperCase()}`;
        if (repeat[0].count !== undefined && repeat[0].count !== 0) {
            str += `;COUNT=${repeat[0].count.toString()}`;
        }
        
        return str;
    }
}

/** Returns a value based on the priority */
let setPriority = function (priority) {
    if (priority === 'High Priority') {
        return 1;
    } else if (priority === 'Low Priority') {
        return 9;
    }
}

/** 
 * Splits string into commas
 * NOT USED. Need to ask how resources actually are defined
 */
let splitResources = function (resources) {
    if (resources === undefined) {
        return undefined;
    } else {
        return resources.split(", ").join(",").toUpperCase();
    }
}

/** 
 * Email validator (returns true/false) 
 * Taken from https://stackoverflow.com/questions/46155/
 * how-to-validate-an-email-address-in-javascript
 */
let validateEmail = function (email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Geolocation validator (returns true/false)
 * Taken from https://stackoverflow.com/questions/3518504/
 * regular-expression-for-matching-latitude-longitude-coordinates
 */
let validateGeoloc = function (geolocation) {
    let re = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    return re.test(geolocation);
}

let printGeo = function (geolocation) {
    if (geolocation) {
        geolocation.replace(/,\s*/, ';')
    } else {
        return '';
    }
}

/** 
 * Checks if rsvp emails are valid 
 * If email is not valid, it returns true
 */
let rsvpValidate = function (rsvp) {
    for (let i = 0; i < rsvp.length; i++) {
        if (!validateEmail(rsvp[i].email)) {
            return true;
        }
    }
    return false;
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
export { add, dateFormatter, rsvpValidate, Stuffs, StuffSchema, validateGeoloc };
