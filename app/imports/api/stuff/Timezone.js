const moment = require('moment-timezone');

const MAX_OCCUR = 2;
const getVTZ = (tzName) => {
    const zone = moment.tz.zone(tzName);
    const header = `BEGIN:VTIMEZONE\nTZID:${tzName}`;
    const footer = 'END:VTIMEZONE';
  
    let zTZitems = '';
    let zTZprops = [];
    for(let i = 0; i < MAX_OCCUR && i + 1 < zone.untils.length; i++){
        const type = i%2 == 0 ? 'STANDARD' : 'DAYLIGHT';
        const momDtStart = moment.tz(zone.untils[i], tzName);
        const momNext = moment.tz(zone.untils[i+1], tzName);
        
        const item = 
            `BEGIN:${type}
            DTSTART:${momDtStart.format('YYYYMMDDTHHmmss')}
            TZOFFSETFROM:${momDtStart.format('ZZ')}
            TZOFFSETTO:${momNext.format('ZZ')}
            TZNAME:${zone.abbrs[i]}
            END:${type}\n`;
        
        zTZitems += item;

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

    const result = `${header}\n${zTZitems}${footer}\n`;

    return zTZprops;
};

// console.log(getVTZ(Intl.DateTimeFormat().resolvedOptions().timeZone))


/** Make the collection and schema available to other code. */
export { getVTZ };
