import * as axios from 'axios';

export interface IActivityService {
    uploadActivity(file: File) : Promise<void>;
}

class Urls {

    //private readonly serverName = 'http://localhost:3001';
    private readonly serverName = '';

    getCreateActivityUrl() : string {
        return `${this.serverName}/api/activity`;
    }
}

export class ActivityService implements IActivityService {
    async uploadActivity(file: File): Promise<void> {
        try {
            await axios.default.put(this.urls.getCreateActivityUrl(), file, { headers: { 'Content-Type' : 'application/xml'}});
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    }

    private readonly urls = new Urls();
}