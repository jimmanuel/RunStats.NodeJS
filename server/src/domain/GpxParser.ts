import fastXmlParser = require('fast-xml-parser');
import { RunActivity } from './RunActivity';
import { DataPoint } from "./DataPoint";
import { DateTimeHelper } from './DateTimeHelper';

export class GpxParser {

    static parseGpx(xmlData: string) : RunActivity {

        if (!fastXmlParser.validate(xmlData)) {
            throw new Error("invalid input file");
        }

        let options = {
            attrPrefix : "@_",
            attrNodeName: false,
            textNodeName : "#text",
            ignoreNonTextNodeAttr : true,
            ignoreTextNodeAttr : true,
            ignoreNameSpace : true,
            ignoreRootElement : false,
            textNodeConversion : true,
            textAttrConversion : false,
            arrayMode : false
        };

        let tObj = fastXmlParser.getTraversalObj(xmlData,options);
        let jsonObj = fastXmlParser.convertToJson(tObj);
        
        let startEpoch = DateTimeHelper.convertToEpoch(jsonObj.gpx.trk.time);

        return new RunActivity(startEpoch, 0, 0, null);
    }
}