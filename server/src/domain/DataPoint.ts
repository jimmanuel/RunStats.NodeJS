export class DataPoint {
    readonly latitude: number;
    readonly longitude: number;
    readonly altitude: number;
    readonly epochTime: number;

    constructor(
        latitude: number,
        longitude: number,
        altitude: number,
        epochTime: number
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.epochTime = epochTime;
    }

    static sortByTime(x: DataPoint, y: DataPoint) : number {
        if (x.epochTime < y.epochTime) {
            return -1;
          }
          if (x.epochTime > y.epochTime) {
            return 1;
          }
          return 0;
    }
}