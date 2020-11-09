// @flow
import { moment } from 'capture-core-utils/moment';
import { createReducerDescription } from '../../../trackerRedux/trackerReducer';
import { workingListsCommonActionTypes } from '../../../components/Pages/MainPage/WorkingListsCommon';
import { eventWorkingListsActionTypes } from '../../../components/Pages/MainPage/EventWorkingLists';
import { recentlyAddedEventsActionTypes } from '../../../components/Pages/NewEvent/RecentlyAddedEventsList';

export const workingListsTemplatesDesc = createReducerDescription({
    [workingListsCommonActionTypes.TEMPLATES_FETCH]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                loading: true,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATES_FETCH_SUCCESS]: (state, action) => {
        const { templates, listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates,
                loading: false,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATES_FETCH_ERROR]: (state, action) => {
        const { listId, error } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                loadError: error,
                loading: false,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_SELECT]: (state, action) => {
        const { listId, templateId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: templateId,
                currentListId: listId,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { eventQueryCriteria, template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const updatedTemplate = {
            ...template,
            nextEventQueryCriteria: eventQueryCriteria,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
        const { eventQueryCriteria, templateId, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {  // the template could be deleted
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                eventQueryCriteria,
                nextEventQueryCriteria: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
        const { templateId, listId } = action.payload;

        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                nextEventQueryCriteria: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { name, eventQueryCriteria, template, clientId, listId } = action.payload;

        const newTemplate = {
            ...template,
            name,
            displayName: name,
            id: clientId,
            eventQueryCriteria,
            isDefault: undefined,
            notPreserved: true,
            skipInitDuringAddProcedure: true,
            access: {
                read: true,
                update: true,
                delete: true,
                write: true,
                manage: true,
            },
        };

        const templates = state[listId].templates;

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: clientId,
                templates: [
                    ...templates,
                    newTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_SKIP_INIT_CLEAN]: (state, action) => {
        const { template, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === template.id);

        if (targetTemplate) {
            const otherTemplates = templates.filter(t => t.id !== template.id);

            const updatedTemplate = {
                ...targetTemplate,
                skipInitDuringAddProcedure: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
        const { templateId, clientId, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === clientId);
        const otherTemplates = templates.filter(t => t.id !== clientId);

        const currentlySelectedTemplateId = state[listId].selectedTemplateId;

        let selectedTemplateId = currentlySelectedTemplateId;
        let skipInitDuringAddProcedure;
        if (currentlySelectedTemplateId === clientId) {
            selectedTemplateId = templateId;
            skipInitDuringAddProcedure = true;
        }

        const updatedTemplate = {
            ...targetTemplate,
            id: templateId,
            notPreserved: undefined,
            skipInitDuringAddProcedure,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId,
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
        const { clientId, listId } = action.payload;
        const templates = state[listId].templates.filter(t => t.id !== clientId);
        const currentlySelectedTemplateId = state[listId].selectedTemplateId;
        const selectedTemplateId = currentlySelectedTemplateId === clientId ?
            templates.find(t => t.isDefault).id :
            currentlySelectedTemplateId;

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId,
                templates,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE]: (state, action) => {
        const { template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const deletedTemplate = {
            ...template,
            deleted: true,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: otherTemplates.find(t => t.isDefault).id,
                templates: [
                    ...otherTemplates,
                    deletedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS]: (state, action) => {
        const { template, listId } = action.payload;
        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);

        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR]: (state, action) => {
        const { template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const failedToDeleteTemplate = {
            ...template,
            deleted: undefined,
        };
        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                    failedToDeleteTemplate,
                ],
            },
        };
    },
}, 'workingListsTemplates');

export const workingListsDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers, request } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
            currentRequest: request,
        };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers, request } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
            currentRequest: request,
        };

        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_ITEM_PREPEND]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: [itemId, ...(state[listId] ? state[listId].order : [])],
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_ITEM_REMOVE]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: state[listId] ? state[listId].order.filter(i => i !== itemId) : [],
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = { order: [] };
        return newState;
    },
}, 'workingLists');

const getReadyState = (oldState, more) => ({
    ...oldState,
    ...more,
    isLoading: false,
    isUpdating: false,
    isUpdatingWithDialog: false,
});

export const workingListsUIDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isLoading: true };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            hasBeenLoaded: true,
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = getReadyState({}, {
            dataLoadingError: payload.errorMessage,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isUpdating: true };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState({}, {
            dataLoadingError: null,
        });
        return newState;
    },
    [eventWorkingListsActionTypes.EVENT_REQUEST_DELETE]: (state, action) => {
        const listId = action.payload.listId;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                isUpdatingWithDialog: true,
            },
        };
    },
    [eventWorkingListsActionTypes.EVENT_DELETE_SUCCESS]: (state, action) => {
        const { listId, eventId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                lastEventIdDeleted: eventId,
            },
        };
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const { listId, config: { customColumnOrder } } = action.payload;
        return {
            ...state,
            [listId]: customColumnOrder,
        };
    },
    [workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET]: (state, action) => {
        const { columns, listId } = action.payload;
        return {
            ...state,
            [listId]: columns
                .map(({ id, visible }) => ({
                    id,
                    visible,
                })),
        };
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = [...action.payload.customColumnOrder];
        return newState;
    },
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    /*
    Setting context on fetch/init (not on success anymore) because it makes sense for the loading effect.
    The meaning is slightly changed though, having a context now implies that a request was done for this context,
    not that data was successfully retrieved for this context.
    */
    [workingListsCommonActionTypes.TEMPLATES_FETCH]: (state, action) => {
        const { programId, listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                programIdTemplates: programId,
            },
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const newState = { ...state };
        const { listId, context: { programId, ...restContext } } = action.payload;
        newState[listId] = {
            ...newState[listId],
            ...restContext,
            programIdView: programId,
            timestamp: moment().toISOString(),
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.selections;
        return newState;
    },
}, 'workingListsContext');

export const workingListsStickyFiltersDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const { listId, config } = action.payload;
        const filters = config.filters;
        const filtersWithValueOnInit = filters ? Object.keys(filters).reduce((acc, key) => ({
            ...acc,
            [key]: true,
        }), {}) : undefined;

        return {
            ...state,
            [listId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.REST_MENU_ITEM_SELECT]: (state, action) => {
        const { id, listId } = action.payload;
        const currentListState = {
            ...state[listId],
            userSelectedFilters: {
                ...state[listId].userSelectedFilters,
                [id]: true,
            },
        };

        return {
            ...state,
            [listId]: currentListState,
        };
    },
    [workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET]: (state, action) => {
        const { listId, includeFilters: filtersWithValueOnInit } = action.payload;
        return {
            ...state,
            [listId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
}, 'workingListsStickyFilters');
