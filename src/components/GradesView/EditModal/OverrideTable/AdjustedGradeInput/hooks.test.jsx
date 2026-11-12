import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { getLocalizedSlash } from 'i18n/utils';
import { actions, selectors } from 'data/redux/hooks';
import messages from '../messages';
import useAdjustedGradeInputData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useEditModalPossibleGrade: jest.fn(),
    },
    app: {
      useModalData: jest.fn(),
    },
  },
  actions: {
    app: {
      useSetModalState: jest.fn(),
    },
  },
}));
jest.mock('i18n/utils', () => ({ getLocalizedSlash: jest.fn() }));

const localizedSlash = 'localized-slash';
getLocalizedSlash.mockReturnValue(localizedSlash);

const possibleGrade = 105;
selectors.root.useEditModalPossibleGrade.mockReturnValue(possibleGrade);
const modalData = { adjustedGradeValue: 70 };
const setModalState = jest.fn();
selectors.app.useModalData.mockReturnValue(modalData);
actions.app.useSetModalState.mockReturnValue(setModalState);

let out;
describe('useAdjustedGradeInputData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useAdjustedGradeInputData();
  });
  describe('behavior', () => {
    it('initializes intl and redux hooks', () => {
      expect(useIntl).toHaveBeenCalled();
      expect(selectors.root.useEditModalPossibleGrade).toHaveBeenCalled();
      expect(selectors.app.useModalData).toHaveBeenCalled();
      expect(actions.app.useSetModalState).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    it('forwards adjusted grade value as value from modal data', () => {
      expect(out.value).toEqual(modalData.adjustedGradeValue);
    });
    describe('hintText', () => {
      it('passes an undefined value if possibleGrade is not available', () => {
        selectors.root.useEditModalPossibleGrade.mockReturnValueOnce(undefined);
        out = useAdjustedGradeInputData();
        expect(out.hintText).toEqual(undefined);
      });
      it('passes localized slash and possible grade if available', () => {
        expect(out.hintText).toEqual(` ${localizedSlash} ${possibleGrade}`);
      });
    });
    describe('validation feedback', () => {
      const invalidFeedback = { type: 'invalid', text: formatMessage(messages.adjustedGradeInvalid) };
      const warningFeedback = {
        type: 'warning',
        text: formatMessage(messages.adjustedGradeExceedsPossible, { adjustedGrade: '110', possibleGrade }),
      };
      it.each([
        ['empty', '', null, false],
        ['valid', '70', null, false],
        ['invalid', 'abc', invalidFeedback, true],
        ['above possible', '110', warningFeedback, false],
      ])('for %s adjusted grade %p passes the matching feedback and isInvalid', (_, value, feedback, isInvalid) => {
        selectors.app.useModalData.mockReturnValueOnce({ adjustedGradeValue: value });
        out = useAdjustedGradeInputData();
        expect(out.feedback).toEqual(feedback);
        expect(out.isInvalid).toEqual(isInvalid);
      });
    });
    describe('onChange', () => {
      it('sets modal state with event target value', () => {
        const testValue = 'test-value';
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: testValue });
      });
    });
  });
});
