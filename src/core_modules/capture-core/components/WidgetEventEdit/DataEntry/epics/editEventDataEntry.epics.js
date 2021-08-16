// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { rulesExecutedPostUpdateField } from '../../../DataEntry/actions/dataEntry.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../../Pages/ViewEvent/ViewEventComponent/editEvent.actions';
import {
    openEventForEditInDataEntry,
    prerequisitesErrorOpeningEventForEditInDataEntry,
    batchActionTypes as editEventDataEntryBatchActionTypes,
    actionTypes as editEventDataEntryActionTypes,
} from '../editEventDataEntry.actions';
import { getProgramAndStageFromEvent, getProgramThrowIfNotFound } from '../../../../metaData';
import {
    getRulesActionsForEvent,
    getCurrentClientValues,
    getCurrentClientMainData,
} from '../../../../rules/actionsCreator';
import { getStageFromEvent } from '../../../../metaData/helpers/getStageFromEvent';
import { EventProgram, TrackerProgram } from '../../../../metaData/Program';
import type { FieldData } from '../../../../rules/actionsCreator';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { prepareEnrollmentEventsForRulesEngine } from '../../../../events/getEnrollmentEvents';

export const openEditEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            editEventActionTypes.START_OPEN_EVENT_FOR_EDIT,
        ),
        map((action) => {
            const state = store.value;
            const eventContainer = action.payload.eventContainer;
            const orgUnit = action.payload.orgUnit;

            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorOpeningEventForEditInDataEntry(metadataContainer.error);
            }
            const foundation = metadataContainer.stage.stageForm;
            const program = metadataContainer.program;


            return batchActions(openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program, state.enrollmentSite?.events));
        }));


const runRulesForEditSingleEvent = (store: ReduxStore, dataEntryId: string, itemId: string, uid: string, fieldData?: ?FieldData) => {
    const state = store.value;
    const formId = getDataEntryKey(dataEntryId, itemId);
    const eventId = state.dataEntries[dataEntryId].eventId;
    const event = state.events[eventId];
    const { programId } = state.currentSelections;
    const program = getProgramThrowIfNotFound(programId);

    const orgUnitId = state.currentSelections.orgUnitId;
    const orgUnit = state.organisationUnits[orgUnitId];
    const stage = program instanceof EventProgram
        ? program.stage
        : getStageFromEvent(event)?.stage;

    const foundation = stage?.stageForm;
    const currentEventValues = foundation ? getCurrentClientValues(state, foundation, formId, fieldData) : {};

    let currentEventMainData = foundation ? getCurrentClientMainData(state, itemId, dataEntryId, foundation) : {};
    currentEventMainData = { ...state.events[eventId], ...currentEventMainData };
    const currentEventData = { ...currentEventValues, ...currentEventMainData };
    const allEvents = state.enrollmentSite?.events;
    const allEventsData = program instanceof TrackerProgram && allEvents
        ? [...prepareEnrollmentEventsForRulesEngine(currentEventData, allEvents)]
        : [currentEventData];

    const rulesActions = getRulesActionsForEvent(
        program,
        foundation,
        formId,
        orgUnit,
        currentEventData,
        allEventsData,
        stage,
    );

    return batchActions([
        ...rulesActions,
        rulesExecutedPostUpdateField(dataEntryId, itemId, uid),
    ],
    editEventDataEntryBatchActionTypes.RULES_EFFECTS_ACTIONS_BATCH);
};

export const runRulesOnUpdateDataEntryFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { dataEntryId, itemId, uid } = action.payload;
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid);
        }));

export const runRulesOnUpdateFieldForEditSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(editEventDataEntryBatchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH),
        map(actionBatch => actionBatch.payload.find(action => action.type === editEventDataEntryActionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { elementId, value, uiState, dataEntryId, itemId, uid } = action.payload;
            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };
            return runRulesForEditSingleEvent(store, dataEntryId, itemId, uid, fieldData);
        }));

