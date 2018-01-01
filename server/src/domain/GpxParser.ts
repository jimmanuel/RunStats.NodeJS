import { fastXmlParser } from 'fast-xml-parser';
import { RunActivity } from './RunActivity';
import { DataPoint } from "./DataPoint";

export class GpxParser {

    static parseGpx(fileName: string, xmlData: string) : RunActivity {
        if (fileName == null || fileName.length == 0 ) {
            throw new Error("invalid input file name");
        }
        
/*
        let xmlParser = new fastXmlParser();
        if (!xmlParser.validate(xmlData)) {
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

        let tObj = xmlParser.getTraversalObj(xmlData,options);
        let jsonObj = xmlParser.convertToJson(tObj);
        
        let startEpoch = jsonObj.trk.time;
*/
        return null;
    }
}