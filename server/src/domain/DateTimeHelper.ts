import * as moment from 'moment';

export class DateTimeHelper {
    static convertToEpoch(dateTime : string) : number {
        // convert something that looks like "2011-10-18T18:35:41Z" into an epoch time
        // life is easy with so many js libs out there
        return moment(dateTime).unix();
    }
}