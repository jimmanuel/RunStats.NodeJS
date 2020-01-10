import * as fs from 'fs';
import xml2js = require('xml2js');
import { GpxParser } from '../../src/domain/GpxParser'

describe('GpxParser', () => {
  describe("parseGpx", () => {
    it('should load file one correctly', async () => {
        let content = fs.readFileSync(__dirname + '/../../../test/res/RK_gpx_2011-10-18_0635PM.gpx').toString();
		
        let activity = await new GpxParser().parseGpx(content);
		expect(activity).toBeDefined();
		expect(activity.epochStartTime).toEqual(1318962941);
		expect(activity.dataPoints).toBeDefined();
		expect(activity.dataPoints.length).toEqual(205)

	  });
	  
	  it('should also work on a pre-parsed file correctly', async () => {
			let content = fs.readFileSync(__dirname + '/../../../test/res/RK_gpx_2011-10-18_0635PM.gpx').toString();
			let parser = new xml2js.Parser();
			let xmlThing = await parser.parseStringPromise(content);

			let activity = await new GpxParser().parseGpx(xmlThing);
			expect(activity).toBeDefined();
			expect(activity.epochStartTime).toEqual(1318962941);
			expect(activity.dataPoints).toBeDefined();
			expect(activity.dataPoints.length).toEqual(205)

		});
	  
	
      it('should load file two correctly', async () => {
        let content = fs.readFileSync(__dirname + '/../../../test/res/RK_gpx _2012-04-26_0704.gpx').toString();
		
		let activity = await new GpxParser().parseGpx(content);
		expect(activity).toBeDefined();
		expect(activity.epochStartTime).toEqual(1335431097);
		expect(activity.dataPoints).toBeDefined();
		expect(activity.dataPoints.length).toEqual(160)

		expect(activity.dataPoints[0].altitude).toEqual('73.2');
		expect(activity.dataPoints[0].latitude).toEqual('38.888073000');
		expect(activity.dataPoints[0].longitude).toEqual('-77.088644000');

		expect(activity.dataPoints[87].altitude).toEqual('83.7');
		expect(activity.dataPoints[87].latitude).toEqual('38.881250000');
		expect(activity.dataPoints[87].longitude).toEqual('-77.098731000');

		expect(activity.dataPoints[153].altitude).toEqual('76.3');
		expect(activity.dataPoints[153].latitude).toEqual('38.886893000');
		expect(activity.dataPoints[153].longitude).toEqual('-77.089452000');
	  });

	  it ('should merge track segments correctly', async () => {
		let content = fs.readFileSync(__dirname + '/../../../test/res/RK_gpx _2019-05-19_1006.gpx').toString();
				
		let activity = await new GpxParser().parseGpx(content);
		expect(activity).toBeDefined();
		expect(activity.dataPoints).toBeDefined();
		expect(activity.dataPoints.length).toEqual(919)
	  })
  });
});