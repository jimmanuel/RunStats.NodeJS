import { IActivityItem } from '../../services/ActivityService';
import React from 'react';
import { ActivityListItem } from './ActivityListItem';

interface ActivityListProps {
    activities: IActivityItem[];
  }


export class ActivityList extends React.Component<ActivityListProps, any> {

    render() {
        const itemFactory = this.props.activities.map(x => <li><ActivityListItem activity={x} /></li>);
        let message = `There are ${this.props.activities.length} activities.`;
        if (this.props.activities.length == 1) {
            message = `There is 1 activity.`;
        }
      return (
      <div className="Activity-List">
      {message}
          <ul>{itemFactory}</ul>
      </div>)
    }
  
    constructor(props: any) {
      super(props);
    }
  }
  
  export default ActivityList;
  