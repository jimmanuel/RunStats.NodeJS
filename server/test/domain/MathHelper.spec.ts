import * as fs from 'fs';
import { GpxParser } from '../../src/domain/GpxParser'

// rely on the GpxParser tests to cover parsing GPX files correctly; here we assume it works

describe('MathHelper', () => {
  describe("calcuateDistance", () => {
	  it('should calculate distance correctly', async () => {
        let content = fs.readFileSync(__dirname + '/../../../test/res/RK_gpx _2012-04-26_0704.gpx').toString();
		let activity = await new GpxParser().parseGpx(content);
		expect(activity).toBeDefined();
		expect(activity.distanceMeters).toEqual(4659.543726307642);
	  });
  });
});