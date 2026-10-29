import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import messages from './messages';

export const useStatusAlertsData = () => {
  const { formatMessage } = useIntl();

  const assignmentValidity = selectors.app.useAssignmentGradeFilterValidity();
  const courseValidity = selectors.app.useCourseGradeFilterValidity();
  const selectedAssignment = selectors.filters.useSelectedAssignmentLabel();
  const showSuccessBanner = selectors.grades.useShowSuccess();
  const handleCloseSuccessBanner = actions.grades.useCloseBanner();

  const gradeFilterMessages = [
    ...(selectedAssignment ? [
      [assignmentValidity.isMinValid, messages.minAssignmentGradeInvalid],
      [assignmentValidity.isMaxValid, messages.maxAssignmentGradeInvalid],
      [assignmentValidity.isRangeValid, messages.assignmentGradeRangeInvalid],
    ] : []),
    [courseValidity.isMinValid, messages.minGradeInvalid],
    [courseValidity.isMaxValid, messages.maxGradeInvalid],
    [courseValidity.isRangeValid, messages.courseGradeRangeInvalid],
  ].filter(([isValid]) => !isValid).map(([, message]) => formatMessage(message));

  return {
    successBanner: {
      onClose: handleCloseSuccessBanner,
      show: showSuccessBanner,
      text: formatMessage(messages.editSuccessAlert),
    },
    gradeFilter: {
      show: gradeFilterMessages.length > 0,
      messages: gradeFilterMessages,
    },
  };
};
export default useStatusAlertsData;
