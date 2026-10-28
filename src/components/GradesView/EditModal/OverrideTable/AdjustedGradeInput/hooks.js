import { useIntl } from '@edx/frontend-platform/i18n';

import {
  adjustedGradeStatuses,
  getAdjustedGradeStatus,
} from 'components/GradesView/EditModal/adjustedGrade';
import { actions, selectors } from 'data/redux/hooks';
import { getLocalizedSlash } from 'i18n/utils';

import messages from '../messages';

const useAdjustedGradeInputData = () => {
  const { formatMessage } = useIntl();
  const possibleGrade = selectors.root.useEditModalPossibleGrade();
  const value = selectors.app.useModalData().adjustedGradeValue;
  const setModalState = actions.app.useSetModalState();
  const hintText = possibleGrade && ` ${getLocalizedSlash()} ${possibleGrade}`;
  const status = getAdjustedGradeStatus(value, possibleGrade);
  const isInvalid = status === adjustedGradeStatuses.invalid;

  let feedback = null;
  if (isInvalid) {
    feedback = { type: 'invalid', text: formatMessage(messages.adjustedGradeInvalid) };
  } else if (status === adjustedGradeStatuses.exceedsPossible) {
    feedback = {
      type: 'warning',
      text: formatMessage(messages.adjustedGradeExceedsPossible, { adjustedGrade: value, possibleGrade }),
    };
  }

  const onChange = ({ target }) => {
    setModalState({ adjustedGradeValue: target.value });
  };

  return {
    value,
    onChange,
    hintText,
    isInvalid,
    feedback,
  };
};

export default useAdjustedGradeInputData;
