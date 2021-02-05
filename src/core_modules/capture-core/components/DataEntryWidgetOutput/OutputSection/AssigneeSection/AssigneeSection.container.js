// @flow
import { connect } from 'react-redux';
import AssigneeSection from './AssigneeSection.component';
import { setAssignee } from './assigneeSection.actions';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';

const mapStateToProps = (state: ReduxState, { selectedScopeId }) => {
    const assigneeSection = state.viewEventPage.assigneeSection || {};

    return {
        programStage: getEventProgramThrowIfNotFound(selectedScopeId).stage,
        assignee: (!assigneeSection.isLoading) ?
            state.viewEventPage.loadedValues.eventContainer.event.assignee :
            undefined,
        ready: !assigneeSection.isLoading,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSet: (user: Object) => {
        dispatch(setAssignee(user));
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(AssigneeSection);
