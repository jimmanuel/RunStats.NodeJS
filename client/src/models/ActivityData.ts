import { IDataPoint } from '../services/DataPointService';

export interface IGeoPoint { 
    latitude: number;
    longitude: number;
}

export interface IActivityBounds {
    topLeft: IGeoPoint;
    bottomLeft: IGeoPoint;
    topRight: IGeoPoint;
    bottomRight: IGeoPoint;
}

export class ActivityData {

    getActivityBounds() : IActivityBounds {
        let topMost : IDataPoint | undefined = undefined;
        let rightMost :IDataPoint | undefined  = undefined;
        let leftMost : IDataPoint | undefined  = undefined;
        let bottomMost : IDataPoint | undefined  = undefined;
        
        for (let point of this.dataPoints)
        {
            if (topMost == null ||
                (+topMost.latitude > +point.latitude))
                topMost = point;
            
            if (rightMost == null ||
                (+rightMost.longitude > +point.longitude))
                rightMost = point;
            
            if (leftMost == null ||
                (+leftMost.latitude < +point.latitude))
                leftMost = point;
            
            if (bottomMost == null ||
                (+bottomMost.longitude < +point.longitude))
                bottomMost = point;
        }

        if (!topMost || !rightMost || !leftMost || ! bottomMost) {
            throw new Error ('could not find bounds for activity');
        }

        return { 
            topLeft: { latitude: +topMost.latitude, longitude: +leftMost.longitude },
            bottomLeft: { latitude: +bottomMost.latitude, longitude: +leftMost.longitude },
            topRight: { latitude: +topMost.latitude, longitude: +rightMost.longitude },
            bottomRight: { latitude: +bottomMost.latitude, longitude: +rightMost.longitude }
        }
    }

    public constructor (private dataPoints: IDataPoint[]) {
    }
}