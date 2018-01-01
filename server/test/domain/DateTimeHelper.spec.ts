import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';
import { DateTimeHelper } from '../../src/domain/DateTimeHelper';

describe("DateTimeHelper", () => {
    describe("convertToEpoch", () => {
        it ("should convert correctly", () => {
            let result = DateTimeHelper.convertToEpoch("2018-01-01T21:35:12Z");
            expect(result).to.equal(1514842512);
        });
    })
});