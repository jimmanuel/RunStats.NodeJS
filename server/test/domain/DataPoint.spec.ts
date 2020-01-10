import { DataPoint } from '../../src/domain/DataPoint';

describe('DataPoint', () => {
    describe('sortByTime', () => {
        it('should sort correctly', () => {
            let inputs: DataPoint[] = [
                new DataPoint(0,0,0,2),
                new DataPoint(0,0,0,5),
                new DataPoint(0,0,0,3),
                new DataPoint(0,0,0,5),
                new DataPoint(0,0,0,1)
            ]

            const sorted = inputs.sort(DataPoint.sortByTime);

            expect(sorted).toBeDefined();
            expect(sorted.length).toBe(5);
            expect(sorted[0].epochTime).toBe(1);
            expect(sorted[1].epochTime).toBe(2);
            expect(sorted[2].epochTime).toBe(3);
            expect(sorted[3].epochTime).toBe(5);
            expect(sorted[4].epochTime).toBe(5);
        })
    })
})