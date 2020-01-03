import React from "react";
import { IActivityItem } from "../../services/ActivityService";

export interface IActivityListItemProps {
    activity: IActivityItem;
}

export class ActivityListItem extends React.Component<IActivityListItemProps, any> {
    public render() : JSX.Element {

        let startDate = new Date(0);
        startDate.setUTCSeconds(this.props.activity.epochStartTime);


    return <label>{startDate.toLocaleString()}</label>;
    }    
}