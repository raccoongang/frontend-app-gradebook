/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import simpleSelectorFactory from '../utils';
import * as module from './app';
import { minGrade, maxGrade } from './grades';

/**
 * gradeLimitsValidity(min, max, upperLimit)
 * returns { isMaxValid, isMinValid, isRangeValid } for a pair of grade filter limits.
 * Each limit must be a number not less than minGrade (0) and not more than upperLimit.
 * The range (min <= max) is only checked once both limits are valid.
 * @param {string} min - entered minimum grade
 * @param {string} max - entered maximum grade
 * @param {string|number} [upperLimit] - highest allowed limit, none by default
 * @return {object} - { isMaxValid, isMinValid, isRangeValid }
 */
const gradeLimitsValidity = (min, max, upperLimit = Infinity) => {
  const minValue = parseFloat(min);
  const maxValue = parseFloat(max);
  const isLimitValid = (value) => value >= minGrade && value <= upperLimit;
  const isMinValid = isLimitValid(minValue);
  const isMaxValid = isLimitValid(maxValue);
  return {
    isMaxValid,
    isMinValid,
    isRangeValid: !(isMinValid && isMaxValid) || minValue <= maxValue,
  };
};

/**
 * areLimitsValid(validity)
 * returns true iff both limits are valid and min <= max
 * @param {object} validity - { isMaxValid, isMinValid, isRangeValid }
 * @return {bool} - are the limits valid?
 */
const areLimitsValid = ({ isMaxValid, isMinValid, isRangeValid }) => (
  isMaxValid && isMinValid && isRangeValid
);

/**
 * assignmentGradeFilterValidity(state)
 * returns { isMaxValid, isMinValid, isRangeValid } for the assignment grade limits.
 * There is no upper bound: a grade override can exceed the possible points of an assignment.
 * @param {object} state - redux state
 * @return {object} - { isMaxValid, isMinValid, isRangeValid }
 */
export const assignmentGradeFilterValidity = ({ app: { filters } }) => (
  gradeLimitsValidity(filters.assignmentGradeMin, filters.assignmentGradeMax)
);

/**
 * assignmentGradeLimits(state)
 * returns an object of local assignmentGradeMin/Max
 * @param {object} state - redux state
 * @return {object} - { assignmentGradeMin, assignmentGradeMax }
 */
const assignmentGradeLimits = (
  { app: { filters: { assignmentGradeMin, assignmentGradeMax } } },
) => ({ assignmentGradeMin, assignmentGradeMax });

/**
 * courseGradeFilterValidity(state)
 * returns { isMaxValid, isMinValid, isRangeValid } for the course grade limits.
 * Each limit must be between minGrade and maxGrade (0, 100).
 * @param {object} state - redux state
 * @return {object} - { isMaxValid, isMinValid, isRangeValid }
 */
export const courseGradeFilterValidity = ({ app: { filters } }) => (
  gradeLimitsValidity(filters.courseGradeMin, filters.courseGradeMax, maxGrade)
);

/**
 * courseGradeLimits(state)
 * returns an object of local courseGradeMin/Max
 * @param {object} state - redux state
 * @return {object} - { courseGradeMin, courseGradeMax }
 */
const courseGradeLimits = (
  { app: { filters: { courseGradeMin, courseGradeMax } } },
) => ({ courseGradeMin, courseGradeMax });

/**
 * editUpdateDate(state)
 * builds object for update api call from edit modal.
 * @param {object} state - redux state
 * @return {object} - object to pass as update date to updateGrades to apply editModal changes
 */
const editUpdateData = ({ app: { modalState } }) => ([{
  grade: {
    comment: modalState.reasonForChange,
    earned_graded_override: modalState.adjustedGradeValue,
  },
  usage_id: modalState.updateModuleId,
  user_id: modalState.updateUserId,
}]);

/**
 * areAssignmentGradeFiltersValid(state)
 * returns true iff both min and max assignment grade filters are valid and min <= max
 * @param {object} state - redux state
 * @return {bool} - are the assignment grade filters valid?
 */
const areAssignmentGradeFiltersValid = (state) => (
  areLimitsValid(module.assignmentGradeFilterValidity(state))
);

/**
 * areCourseGradeFiltersValid(state)
 * returns true iff both min and max course grade filters are valid (within bounds) and min <= max
 * @param {object} state - redux state
 * @return {bool} - are both filters valid?
 */
const areCourseGradeFiltersValid = (state) => (
  areLimitsValid(module.courseGradeFilterValidity(state))
);

const isFilterMenuClosed = ({ app: { filterMenu } }) => (
  !filterMenu.open && !filterMenu.transitioning
);

const isFilterMenuOpening = ({ app: { filterMenu } }) => (
  filterMenu.transitioning && filterMenu.open
);

const modalSelectors = simpleSelectorFactory(
  ({ app: { modalState } }) => modalState,
  [
    'assignmentName',
    'adjustedGradePossible',
    'adjustedGradeValue',
    'open',
    'reasonForChange',
    'todaysDate',
    'updateUserName',
  ],
);

const modalData = ({ app: { modalState } }) => ({
  assignmentName: modalState.assignmentName,
  adjustedGradePossible: modalState.adjustedGradePossible,
  adjustedGradeValue: modalState.adjustedGradeValue,
  open: modalState.open,
  reasonForChange: modalState.reasonForChange,
  todaysDate: modalState.todaysDate,
  updateUserName: modalState.updateUserName,
});

const filterMenuSelectors = simpleSelectorFactory(
  ({ app: { filterMenu } }) => filterMenu,
  ['open', 'transitioning'],
);

const simpleSelectors = simpleSelectorFactory(
  ({ app }) => app,
  [
    'activeView',
    'courseId',
    'filters',
    'searchValue',
    'showImportSuccessToast',
  ],
);

export default StrictDict({
  areAssignmentGradeFiltersValid,
  areCourseGradeFiltersValid,
  assignmentGradeFilterValidity,
  assignmentGradeLimits,
  courseGradeFilterValidity,
  courseGradeLimits,
  editUpdateData,
  isFilterMenuClosed,
  isFilterMenuOpening,
  ...simpleSelectors,
  modalState: StrictDict(modalSelectors),
  modalData,
  filterMenu: StrictDict({
    ...filterMenuSelectors,
    isClosed: isFilterMenuClosed,
    isOpening: isFilterMenuOpening,
  }),
});
