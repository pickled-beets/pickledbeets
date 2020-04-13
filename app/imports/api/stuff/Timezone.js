/**
 * Code adapted from https://stackoverflow.com/questions/54541035/
 * generate-ics-with-dynamic-vtimezone-using-moment-js
 */
const moment = require('moment-timezone');

const MAX_OCCUR = 2;
const getVTZ = (tzName) => {
    const zone = moment.tz.zone(tzName);
  
    let zTZprops = [];      // Array that would contain Standard Time and DST

    for(let i = 0; i < MAX_OCCUR && i + 1 < zone.untils.length; i++){
        const type = i%2 == 0 ? 'STANDARD' : 'DAYLIGHT';
        const momDtStart = moment.tz(zone.untils[i], tzName);
        const momNext = moment.tz(zone.untils[i+1], tzName);

        const TZprops = {
            TYPE: tzName,
            BEGIN: type,
            DTSTART: momDtStart.format('YYYYMMDDTHHmmss'),
            TZOFFSETFROM:momDtStart.format('ZZ'),
            TZOFFSETTO: momNext.format('ZZ'),
            TZNAME: zone.abbrs[i],
            END: type
        };

        zTZprops.push(TZprops);
    }

    return zTZprops;
};

/** Export the function to be usable by other files */
export { getVTZ };
