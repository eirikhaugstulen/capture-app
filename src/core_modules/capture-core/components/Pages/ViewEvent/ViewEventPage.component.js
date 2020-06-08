// @flow
import React from 'react';
import ViewEvent from './ViewEventComponent/ViewEvent.container';
import ViewEventNewRelationshipWrapper from './Relationship/ViewEventNewRelationshipWrapper.container';
import { LockedSelector } from '../../LockedSelector/container';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
};

const ViewEventSelector = ({ isUserInteractionInProgress, showAddRelationship }: Props) => (
    <div>
        <LockedSelector isUserInteractionInProgress={isUserInteractionInProgress} />

        {
            showAddRelationship ?
                <ViewEventNewRelationshipWrapper /> :
                <ViewEvent />
        }
    </div>);

export default ViewEventSelector;
