// @flow
import type { EventProgram } from '../../../../../metaData';
import type { FiltersData, AddTemplate, UpdateTemplate, DeleteTemplate } from '../../WorkingLists';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsDataSourceSetupOutputProps } from '../DataSourceSetup';

type ExtractedProps = $ReadOnly<{|
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: EventProgram,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
|}>;

type RestProps = $Rest<EventWorkingListsDataSourceSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsTemplateSetupOutputProps = {|
    ...RestProps,
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: EventProgram,
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
|};
