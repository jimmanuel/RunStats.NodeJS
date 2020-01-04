import * as axios from 'axios';

export interface IActivityItem {
    epochStartTime : number;
    distanceMeters : number;
    durationSeconds : number;
    id: number;
}

export interface IActivityService {
    getAllActivities() : Promise<IActivityItem[]>;
    uploadActivity(file: File) : Promise<void>;
}

export class ActivityService implements IActivityService {
    
    async getAllActivities(): Promise<IActivityItem[]> {
        try {
            const results = await axios.default.get(`/api/activities`, { headers : { 'Accept-Type' : 'application/json'}});
            return results.data.map((x: any) => { return { id: x.id, distanceMeters: x.distanceMeters, durationSeconds: x.duration, epochStartTime: x.epochStartTime }; });
        } catch(error) {
            console.log(JSON.stringify(error))
            throw error;
        }
    }

    async uploadActivity(file: File): Promise<void> {
        try {
            await axios.default.put(`/api/activity`, file, { headers: { 'Content-Type' : 'application/xml'}});
        } catch (error) {
            console.log(JSON.stringify(error))
            throw error;
        }
    }

}