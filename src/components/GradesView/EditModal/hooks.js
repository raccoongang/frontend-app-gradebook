import { selectors, actions, thunkActions } from 'data/redux/hooks';

import { adjustedGradeStatuses, getAdjustedGradeStatus } from './adjustedGrade';

export const useEditModalData = () => {
  const error = selectors.grades.useGradeData().gradeOverrideHistoryError;
  const { open: isOpen, adjustedGradeValue } = selectors.app.useModalData();
  const isSaveDisabled = [
    adjustedGradeStatuses.empty,
    adjustedGradeStatuses.invalid,
  ].includes(getAdjustedGradeStatus(adjustedGradeValue));
  const closeModal = actions.app.useCloseModal();
  const doneViewingAssignment = actions.grades.useDoneViewingAssignment();
  const updateGrades = thunkActions.grades.useUpdateGrades();

  const onClose = () => {
    doneViewingAssignment();
    closeModal();
  };

  const handleAdjustedGradeClick = () => {
    updateGrades();
    doneViewingAssignment();
    closeModal();
  };

  return {
    onClose,
    error,
    handleAdjustedGradeClick,
    isOpen,
    isSaveDisabled,
  };
};

export default useEditModalData;
