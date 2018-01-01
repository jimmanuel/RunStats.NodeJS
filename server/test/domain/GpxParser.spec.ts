import * as fs from 'fs';
import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';
import { GpxParser } from '../../src/domain/GpxParser'

describe('GpxParser', () => {
  describe.skip("parseGpx", () => {
    it('should load a file correctly', () => {
        let content = "";
        fs.readFile('./RK_gpx_2011-10-18_0635PM.gpx', function(e,d) {
          content = d.toString()});

        let activity = GpxParser.parseGpx("RK_gpx_2011-10-18_0635PM.gpx", content);

        expect(activity).to.not.equal(null);
      });
  });
});