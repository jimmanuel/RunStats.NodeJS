import * as fs from 'fs';
import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';
import { GpxParser } from '../../src/domain/GpxParser'

describe('GpxParser', () => {
  describe("parseGpx", () => {
    it('should load a file correctly', () => {
        let content = fs.readFileSync(__dirname + '/RK_gpx_2011-10-18_0635PM.gpx').toString();

        let activity = GpxParser.parseGpx(content);

        expect(activity).to.not.equal(null);
        expect(activity.epochStartTime).to.equal(1318962941);
      });
  });
});