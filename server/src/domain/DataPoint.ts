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
}