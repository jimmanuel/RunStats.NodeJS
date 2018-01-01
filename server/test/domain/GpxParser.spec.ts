import * as fs from 'fs';
import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';
import { GpxParser } from '../../src/domain/GpxParser'

describe('Hello function', () => {

    it('should pass', () => {
        let content = "";
        fs.readFile('./RK_gpx_2011-10-18_0635PM.gpx', function(e,d) {
          content = d.toString()});

        let activity = GpxParser.parseGpx(content);

        expect(activity).to.not.equal(null);
      });
});