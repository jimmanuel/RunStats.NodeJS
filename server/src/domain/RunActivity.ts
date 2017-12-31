import { DataPoint } from './DataPoint';

export class RunActivity {

    readonly dataFileName: string;
    readonly epochStartTime: number;
    readonly distanceMeters: number;
    readonly durationSeconds: number;
    readonly dataPoints: Array<DataPoint>;

    constructor(    
        dataFileName: string,
        epochStartTime: number,
        distanceMeters: number,
        durationSeconds: number,
        dataPoints: Array<DataPoint>
    ) {
        this.dataFileName = dataFileName;
        this.epochStartTime = epochStartTime;
        this.distanceMeters = distanceMeters;
        this.dataPoints = dataPoints;
    }
}