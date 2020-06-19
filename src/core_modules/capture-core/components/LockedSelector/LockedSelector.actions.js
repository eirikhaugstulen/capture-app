// @flow
import { actionCreator } from '../../actions/actions.utils';

export const lockedSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'OrgUnitSet',
    ORG_UNIT_ID_RESET: 'OrgUnitIdReset',
    PROGRAM_ID_SET: 'ProgramIdSet',
    PROGRAM_ID_RESET: 'ProgramIdReset',
    CATEGORY_OPTION_SET: 'CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'AllCategoryOptionsReset',

    SELECTIONS_FROM_URL_UPDATE: 'SelectionsFromUrlUpdate',
    SELECTIONS_FROM_URL_VALID: 'SelectionsFromUrlValid',
    SELECTIONS_FROM_URL_INVALID: 'SelectionsFromUrlInvalid',

    BASED_ON_URL_ORG_UNIT_SET: 'BasedOnUrlOrgUnitSet',
    BASED_ON_URL_ORG_UNIT_ERROR_RETRIEVING: 'BasedOnUrlOrgUnitErrorRetrieving',
    BASED_ON_URL_ORG_UNIT_EMPTY_SET: 'BasedOnUrlOrgUnitEmptySet',

    NEW_EVENT_OPEN: 'NewEventPageOpen',
    PAGE_LOADING_STOP: 'PageLoadingStop',
};

export const lockedSelectorBatchActionTypes = {
    AGAIN_START: 'BatchAgainStartFromPageUsingTheSelector',
    PROGRAM_AND_CATEGORY_OPTION_RESET: 'BatchProgramAndCategoryOptionResetFromPageUsingTheSelector',
};

export const setOrgUnitFromLockedSelector = (id: string, orgUnit: Object) => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_SET)({ id, orgUnit });
export const setProgramIdFromLockedSelector = (id: string) => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_SET)(id);
export const setCategoryOptionFromLockedSelector = (categoryId: string, categoryOption: Object) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });


export const resetOrgUnitIdFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_RESET)();
export const resetProgramIdFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_RESET)();
export const resetCategoryOptionFromLockedSelector = (categoryId: string) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewEventPageFromLockedSelector = (programId: string, orgUnitId: string) => actionCreator(lockedSelectorActionTypes.NEW_EVENT_OPEN)({ programId, orgUnitId });


// url specific
export const updateSelectionsFromUrl = (data: Object) => actionCreator(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE)(data);
export const stopPageLoading = () => actionCreator(lockedSelectorActionTypes.PAGE_LOADING_STOP)();
export const validSelectionsFromUrl = () => actionCreator(lockedSelectorActionTypes.SELECTIONS_FROM_URL_VALID)();
export const invalidSelectionsFromUrl = (error: string) => actionCreator(lockedSelectorActionTypes.SELECTIONS_FROM_URL_INVALID)({ error });
export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) => actionCreator(lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_SET)(orgUnit);
export const errorRetrievingOrgUnitBasedOnUrl = (error: string) => actionCreator(lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_ERROR_RETRIEVING)({ error });
export const setEmptyOrgUnitBasedOnUrl = () => actionCreator(lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_EMPTY_SET)();

