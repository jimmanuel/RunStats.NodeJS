"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class DateTimeHelper {
    static convertToEpoch(dateTime) {
        // convert something that looks like "2011-10-18T18:35:41Z" into an epoch time
        return moment(dateTime).unix();
    }
}
exports.DateTimeHelper = DateTimeHelper;
//# sourceMappingURL=DateTimeHelper.js.map