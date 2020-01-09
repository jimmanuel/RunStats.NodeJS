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

    get orderedPoints() : IDataPoint[] {
        return this.sortedPoints;
    }

    get theStart() : IDataPoint {
        return this.sortedPoints[0];
    }

    get theEnd() : IDataPoint {
        return this.sortedPoints[this.sortedPoints.length-1];
    }

    getActivityBounds() : IActivityBounds {
        let topMost : IDataPoint | undefined = undefined;
        let rightMost :IDataPoint | undefined  = undefined;
        let leftMost : IDataPoint | undefined  = undefined;
        let bottomMost : IDataPoint | undefined  = undefined;
        
        for (let point of this.sortedPoints)
        {
            if (topMost == null ||
                (+topMost.latitude < +point.latitude))
                topMost = point;
            
            if (rightMost == null ||
                (+rightMost.longitude < +point.longitude))
                rightMost = point;
            
            if (leftMost == null ||
                (+leftMost.longitude > +point.longitude))
                leftMost = point;
            
            if (bottomMost == null ||
                (+bottomMost.latitude > +point.latitude))
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

    private readonly sortedPoints : IDataPoint[];

    public constructor (dataPoints: IDataPoint[]) {
        this.sortedPoints = dataPoints.sort((x : IDataPoint, y: IDataPoint) => {
            if (x.epochTime < y.epochTime) return -1;
            if (x.epochTime > y.epochTime) return 1;
            return 0;
          });
    }
}