"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GpxParser {
    static parseGpx(fileName, xmlData) {
        if (fileName == null || fileName.length == 0) {
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
exports.GpxParser = GpxParser;
//# sourceMappingURL=GpxParser.js.map