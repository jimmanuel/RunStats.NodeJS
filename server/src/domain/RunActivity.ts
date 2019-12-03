import { DataPoint } from './DataPoint';

export interface IActivityMetadata {
    id: number;
    distanceMeters: number;
    duration: number;
    epochStartTime: number;
}

export class RunActivity {

    readonly distanceMeters: number;
    readonly duration: number;
    readonly epochStartTime: number;
    readonly dataPoints: Array<DataPoint>;

    constructor(    
        epochStartTime: number,
        dataPoints: Array<DataPoint>
    ) {
        this.epochStartTime = epochStartTime;
        this.dataPoints = dataPoints.slice().sort(DataPoint.sortByTime);

        this.distanceMeters = 0;
        for(let i = 0; i < this.dataPoints.length - 1; i++) {
            this.distanceMeters += this.dataPoints[i].calcuateDistanceTo(this.dataPoints[i+1]);
        }
        this.duration = this.dataPoints[this.dataPoints.length - 1].epochTime - this.dataPoints[0].epochTime;
    }
}