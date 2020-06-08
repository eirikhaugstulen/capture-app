// @flow
import { connect } from 'react-redux';
import ViewEventSelector from './ViewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const isUserInteractionInProgress =
        state.currentSelections.complete &&
        eventDetailsSection.showEditEvent &&
        dataEntryHasChanges(state, 'singleEvent-editEvent');
    return {
        error: state.activePage.viewEventLoadError && state.activePage.viewEventLoadError.error,
        ready: !state.activePage.isLoading,
        isUserInteractionInProgress,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

export const ViewEventPageContainer = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventSelector)));

