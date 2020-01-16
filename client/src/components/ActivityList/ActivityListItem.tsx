import React from "react";
import { IActivityItem } from "../../services/ActivityService";

export interface IActivityListItemProps {
    activity: IActivityItem;
    showOnMap: (id: number) => void;
    showOnHeader: (description: string) => void;    
}

export class ActivityListItem extends React.Component<IActivityListItemProps, any> {


	// private static secondsToString(sec : number) : string 
	// {
	// 	const secPerHour = 60 * 60;
		
	// 	const hours = sec / secPerHour;
		
	// 	sec = (sec - (hours * secPerHour));
		
	// 	const minutes = sec / 60;
	// 	sec = (sec - (minutes * 60));
		
	// 	if (hours > 0)
	// 		return String.format("%d:%02d:%02d", hours, minutes, sec);
	// 	return String.format("%02d:%02d", minutes, sec);
	// }

    private static round(x: number, precision: number) : number {
        const p = Math.pow(10, precision-1);
        return Math.round(x * p) / p;
    }

	private static metersToMiles(meters : number) : number {
		return meters * 0.000621371192;
	}
	

    private getReadableStartTime() : string {
        let startDate = new Date(0);
        startDate.setUTCSeconds(this.props.activity.epochStartTime);
        return startDate.toLocaleString();
    }

    private getReadableDistance() : string {
        return `${ActivityListItem.round(ActivityListItem.metersToMiles(this.props.activity.distanceMeters), 3)} miles`;
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