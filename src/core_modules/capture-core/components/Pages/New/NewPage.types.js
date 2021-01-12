// @flow
import { typeof newPageStatuses } from './NewPage.constants';

export type ProgramCategories = Array<{|name: string, id: string|}>

export type ContainerProps = $ReadOnly<{|
  showMessageToSelectOrgUnitOnNewPage: ()=>void,
  showMessageToSelectProgramCategoryOnNewPage: ()=>void,
  showDefaultViewOnNewPage: ()=>void,
  handleMainPageNavigation: ()=>void,
  currentScopeId: string,
  orgUnitSelectionIncomplete: boolean,
  programCategorySelectionIncomplete: boolean,
  missingCategoriesInProgramSelection: ProgramCategories,
  newPageStatus: $Keys<newPageStatuses>,
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}

