import * as axios from 'axios';

export interface IActivityService {
    uploadActivity(file: File) : Promise<void>;
}

export class ActivityService implements IActivityService {
    async uploadActivity(file: File): Promise<void> {
        try {
            await axios.default.put('http://localhost:3001/api/activity', file, { headers: { 'Content-Type' : 'application/xml'}});
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    }
}