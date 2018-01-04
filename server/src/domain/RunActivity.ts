import { DataPoint } from './DataPoint';

export class RunActivity {

    readonly epochStartTime: number;
    readonly distanceMeters: number;
    readonly durationSeconds: number;
    readonly dataPoints: Array<DataPoint>;

    constructor(    
        epochStartTime: number,
        distanceMeters: number,
        durationSeconds: number,
        dataPoints: Array<DataPoint>
    ) {
        this.epochStartTime = epochStartTime;
        this.distanceMeters = distanceMeters;
        this.dataPoints = dataPoints;
    }
}