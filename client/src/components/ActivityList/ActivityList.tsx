import { IActivityItem } from '../../services/ActivityService';
import React from 'react';
import { ActivityListItem } from './ActivityListItem';

interface ActivityListProps {
    activities: IActivityItem[];
    showOnMap: (id: number) => void;
    showOnHeader: (description: string) => void;
  }


export class ActivityList extends React.Component<ActivityListProps, any> {

  public showOnMap(activityId: number) : void {
    this.props.showOnMap(activityId);
  }

  public showOnHeader(description: string) : void {
    this.props.showOnHeader(description);
  }

  render() {
    const itemFactory = this.props.activities.sort((x, y) => {
        if (x.epochStartTime < y.epochStartTime) return 1;
        if (x.epochStartTime > y.epochStartTime) return -1;
        return 0;
    }).map(x => <p className="Activity-List-Item" key={x.id}><ActivityListItem showOnMap={x => this.showOnMap(x)} showOnHeader={x => this.showOnHeader(x)} activity={x} /></p>);

    let message = `There are ${this.props.activities.length} activities.`;
    if (this.props.activities.length == 1) {
        message = `There is 1 activity.`;
    }

    return (
    <div className="List-Box">
      {message}
      {itemFactory}
    </div>)
  }

  constructor(props: ActivityListProps) {
    super(props);
  }
}

export default ActivityList;
  