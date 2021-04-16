import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) export class UtlityService {
    /**
 * `convertToLocalTimeZone`
 * convert utc time to local timezone
 * @param utcDataTime
 * @returns format: 10/02/2020 7:01:45
 */
    convertToLocalTimeZone = ((utcDataTime: number) => {
        const newDate = new Date();
        const localTimeZoneOffset = newDate.getTimezoneOffset();
        const modifiedTimestamp = `${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getDate())}/${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getMonth() + 1)}/${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getFullYear())} ${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getHours())}:${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getMinutes())}:${String(new Date(((utcDataTime) + (localTimeZoneOffset))).getSeconds())}`;
        return modifiedTimestamp;
    });
}
