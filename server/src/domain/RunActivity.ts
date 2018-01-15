import { DataPoint } from './DataPoint';

export class RunActivity {

    distance: number;
    duration: number;
    readonly epochStartTime: number;
    readonly dataPoints: Array<DataPoint>;

    constructor(    
        epochStartTime: number,
        dataPoints: Array<DataPoint>
    ) {
        this.epochStartTime = epochStartTime;
        this.dataPoints = dataPoints.slice().sort(DataPoint.sortByTime);
    }

    getDistance() : number {
        if (this.distance === null){
            // math happens here    
        }

        return this.distance;
    }
}