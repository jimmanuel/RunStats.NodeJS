import React from "react";
import { IActivityItem } from "../../services/ActivityService";

export interface IActivityListItemProps {
    activity: IActivityItem;
    showOnMap: (id: number) => void;
}

export class ActivityListItem extends React.Component<IActivityListItemProps, any> {
    public handleClick() : void {
        this.props.showOnMap(this.props.activity.id);
    }
    
    public render() : JSX.Element {

        let startDate = new Date(0);
        startDate.setUTCSeconds(this.props.activity.epochStartTime);

        return <label onClick={() => this.handleClick()}>{startDate.toLocaleString()}</label>;
    }    
}