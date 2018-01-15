import * as fs from 'fs';
import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';
import { GpxParser } from '../../src/domain/GpxParser'
import { RunActivity } from '../../src/domain/RunActivity';
import { setTimeout } from 'timers';

describe('GpxParser', () => {
  describe("parseGpx", () => {
    it('should load file one correctly', (done) => {
		setTimeout(done, 500);
        let content = fs.readFileSync(__dirname + '/RK_gpx_2011-10-18_0635PM.gpx').toString();
		
        GpxParser.parseGpx(content, (activity : RunActivity, error : Error) => {
			expect(error).to.be.equal(null, 'there should be no error generated');
			expect(activity).to.not.equal(null, 'a valid activity should be returned');
			expect(activity.epochStartTime).to.equal(1318962941, 'the time should be correct');
			expect(activity.dataPoints).to.not.equal(null, 'there should be data points');
			expect(activity.dataPoints.length).to.equal(205, 'the number of data points should be correct')
		});
      });
	
      it('should load file two correctly', (done) => {
		setTimeout(done, 500);
        let content = fs.readFileSync(__dirname + '/RK_gpx _2012-04-26_0704.gpx').toString();
		
		GpxParser.parseGpx(content, (activity : RunActivity, error : Error) => {
			expect(error).to.equal(null, 'there should be no error generated');
			expect(activity).to.not.equal(null, 'a valid activity should be returned');
			expect(activity.epochStartTime).to.equal(1335431097, 'the time should be correct');
			expect(activity.dataPoints).to.not.equal(null, 'there should be data points');
			expect(activity.dataPoints.length).to.equal(160, 'the number of data points should be correct')

			expect(activity.dataPoints[0].altitude).to.equal('73.2', 'first elevation should be correct');
			expect(activity.dataPoints[0].latitude).to.equal('38.888073000', 'first latitude should be correct');
			expect(activity.dataPoints[0].longitude).to.equal('-77.088644000', 'first longitude should be correct');

			expect(activity.dataPoints[87].altitude).to.equal('83.7', 'middle elevation should be correct');
			expect(activity.dataPoints[87].latitude).to.equal('38.881250000', 'middle latitude should be correct');
			expect(activity.dataPoints[87].longitude).to.equal('-77.098731000', 'middle longitude should be correct');

			expect(activity.dataPoints[153].altitude).to.equal('76.3', 'last elevation should be correct');
			expect(activity.dataPoints[153].latitude).to.equal('38.886893000', 'last latitude should be correct');
			expect(activity.dataPoints[153].longitude).to.equal('-77.089452000', 'last longitude should be correct');
		});
	  });
  });
});