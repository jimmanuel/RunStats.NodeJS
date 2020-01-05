import * as axios from 'axios';

export interface IDataPoint {
    latitude: number;
    longitude: number;
    altitude: number;
    epochTime: number;
}

export interface IDataPointService {
    getDataPoints(activityId: number) : Promise<IDataPoint[]>;
}

export class DataPointService implements IDataPointService {
    async getDataPoints(activityId: number): Promise<IDataPoint[]> {
        try {
            const results = await axios.default.get(`/api/activity/${activityId}`, { headers : { 'Accept-Type' : 'application/json'}});
            return results.data;
        } catch(error) {
            console.log(JSON.stringify(error))
            throw error;
        }
    }

}