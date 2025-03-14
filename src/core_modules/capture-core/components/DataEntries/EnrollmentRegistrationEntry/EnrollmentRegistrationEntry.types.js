// @flow
import type { Node } from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { RenderCustomCardActions } from '../../CardList';
import type { SaveForDuplicateCheck } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';
import type { InputAttribute } from './hooks/useFormValues';
import { RenderFoundation, ProgramStage, Enrollment } from '../../../metaData';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';
import { relatedStageActions } from '../../WidgetRelatedStages';

type TrackedEntityAttributes = Array<{
    attribute: string,
    value: any,
}>;

export type EnrollmentPayload = {|
    trackedEntity: string,
    trackedEntityType: string,
    orgUnit: string,
    geometry: any,
    attributes: TrackedEntityAttributes,
    enrollments: [
        {|
            occurredAt: string,
            orgUnit: string,
            program: string,
            status: string,
            enrolledAt: string,
            events: Array<{
                orgUnit: string,
            }>,
            attributes: TrackedEntityAttributes,
            geometry: any,
        |}
    ],
    relationships?: [
        {
            relationshipType: string,
            from: {
                event: {
                    event: string,
                },
            },
            to: {
                event: {
                    event: string,
                },
            },
        }
    ]
|}

export type OwnProps = $ReadOnly<{|
    id: string,
    orgUnitId: string,
    selectedScopeId: string,
    fieldOptions?: Object,
    onSave: SaveForDuplicateCheck,
    onCancel: () => void,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
    teiId?: ?string,
    skipDuplicateCheck?: ?boolean,
    trackedEntityInstanceAttributes?: Array<InputAttribute>,
    saveButtonText: (trackedEntityName: string) => string,
    firstStageMetaData?: ?{ stage: ProgramStage },
    relatedStageRef?: { current: ?RelatedStageRefPayload },
    relatedStageActionsOptions?: {
        [key: $Keys<typeof relatedStageActions>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
|}>;

type ContainerProps = {|
    ready: boolean,
    orgUnitId: string,
    orgUnit: ?OrgUnit,
    onCancel: () => void,
    isUserInteractionInProgress: boolean,
    isSavingInProgress: boolean,
    enrollmentMetadata: Enrollment,
    formFoundation: RenderFoundation,
    formId: ?string,
    saveButtonText: string,
|};

export type Props = $ReadOnly<{|
    ...OwnProps,
    ...ContainerProps
|}>;

type PropsAddedInHOC = {|
    onPostProcessErrorMessage: Function,
    ...CssClasses,
    onSave: (saveType?: ?string) => void,
|};
type PropsRemovedInHOC = {|
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck,) => Node,
    duplicatesReviewPageSize: number,
    onSave: SaveForDuplicateCheck,
|};

export type PlainProps = {|
    ...$Diff<Props, PropsRemovedInHOC>,
    ...PropsAddedInHOC,
|};

