import { DateTimeHelper } from '../../src/domain/DateTimeHelper';

describe("DateTimeHelper", () => {
    describe("convertToEpoch", () => {
        it ("should convert correctly", () => {
            let result = DateTimeHelper.convertToEpoch("2018-01-01T21:35:12Z");
            expect(result).toEqual(1514842512);
        });
        it ("should convert correctly again", () => {
            let result = DateTimeHelper.convertToEpoch("2012-04-26T09:04:57Z");
            expect(result).toEqual(1335431097);
        });
    })
});