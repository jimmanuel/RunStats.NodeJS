import React from "react";
import { IActivityItem } from "../../services/ActivityService";

export interface IActivityListItemProps {
    activity: IActivityItem;
    showOnMap: (id: number) => void;
    showOnHeader: (description: string) => void;    
}

export class ActivityListItem extends React.Component<IActivityListItemProps, any> {


    private getReadableStartTime() : string {
        let startDate = new Date(0);
        startDate.setUTCSeconds(this.props.activity.epochStartTime);
        return startDate.toLocaleString();
    }

    private getReadableDistance() : string {
        
        return '(Distance)';
    }

    public handleClick() : void {
        this.props.showOnMap(this.props.activity.id);
        this.props.showOnHeader(`>> Start: ${this.getReadableStartTime()}, Time: ${this.getReadableDuration()}, Distance: ${this.getReadableDistance()}`)
    }

    private getReadableDuration(): string {
        return '(Duration)';
    }
    
    public render() : JSX.Element {
        return <label onClick={() => this.handleClick()}>{this.getReadableStartTime()}</label>;
    }    
}