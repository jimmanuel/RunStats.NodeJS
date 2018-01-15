//import xpath = require('xpath');
//import * as x from 'xpath';
//import dom = require('xmldom');
import xml2js = require('xml2js');
import { RunActivity } from './RunActivity';
import { DataPoint } from "./DataPoint";
import { DateTimeHelper } from './DateTimeHelper';

export class GpxParser {

    static parseGpx(xmlData: string, callback:(activity : RunActivity, error: Error) => void) : void {

        let parser = new xml2js.Parser();

        parser.parseString(xmlData, (err, result) => {
            if (!(err === null)) {
                callback(null, err);
                return;
            }

            let timeValue = result.gpx.trk[0].time[0];

            let dataPoints : Array<DataPoint> = new Array();
            let jsonPoints = result.gpx.trk[0].trkseg[0].trkpt;
            for(let dataPointIndex = 0; dataPointIndex < jsonPoints.length; dataPointIndex++) {
                let item = jsonPoints[dataPointIndex];
                dataPoints.push(new DataPoint(item.$.lat, item.$.lon, item.ele[0], DateTimeHelper.convertToEpoch(item.time[0])));                
            }

            callback(
                new RunActivity(DateTimeHelper.convertToEpoch(timeValue), dataPoints), 
                null);
        });
    }
}