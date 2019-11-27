import xml2js = require('xml2js');
import { RunActivity } from './RunActivity';
import { DataPoint } from "./DataPoint";
import { DateTimeHelper } from './DateTimeHelper';

export class GpxParser {

    public static async parseGpx(xmlData: string) : Promise<RunActivity> {

        let parser = new xml2js.Parser();
        
        let result = await parser.parseStringPromise(xmlData); 

        let timeValue = result.gpx.trk[0].time[0];

        let dataPoints : Array<DataPoint> = new Array();
        let jsonPoints = result.gpx.trk[0].trkseg[0].trkpt;
        for(let dataPointIndex = 0; dataPointIndex < jsonPoints.length; dataPointIndex++) {
            let item = jsonPoints[dataPointIndex];
            dataPoints.push(new DataPoint(item.$.lat, item.$.lon, item.ele[0], DateTimeHelper.convertToEpoch(item.time[0])));                
        }

        return new RunActivity(DateTimeHelper.convertToEpoch(timeValue), dataPoints);
    }
}