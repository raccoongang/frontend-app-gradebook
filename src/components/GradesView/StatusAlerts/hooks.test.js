import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { actions, selectors } from 'data/redux/hooks';

import useStatusAlertsData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: { useCloseBanner: jest.fn() },
  },
  selectors: {
    app: {
      useAssignmentGradeFilterValidity: jest.fn(),
      useCourseGradeFilterValidity: jest.fn(),
    },
    filters: { useSelectedAssignmentLabel: jest.fn() },
    grades: { useShowSuccess: jest.fn() },
  },
}));

const validity = {
  isMinValid: true,
  isMaxValid: true,
  isRangeValid: true,
};
selectors.app.useAssignmentGradeFilterValidity.mockReturnValue(validity);
selectors.app.useCourseGradeFilterValidity.mockReturnValue(validity);
selectors.filters.useSelectedAssignmentLabel.mockReturnValue('test-assignment');
const showSuccess = 'test-show-success';
selectors.grades.useShowSuccess.mockReturnValue(showSuccess);
const closeBanner = jest.fn().mockName('hooks.closeBanner');
actions.grades.useCloseBanner.mockReturnValue(closeBanner);

let out;
describe('useStatusAlertsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useStatusAlertsData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(actions.grades.useCloseBanner).toHaveBeenCalled();
      expect(selectors.app.useAssignmentGradeFilterValidity).toHaveBeenCalled();
      expect(selectors.app.useCourseGradeFilterValidity).toHaveBeenCalled();
      expect(selectors.filters.useSelectedAssignmentLabel).toHaveBeenCalled();
      expect(selectors.grades.useShowSuccess).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('successBanner', () => {
      test('onClose and show from redux', () => {
        expect(out.successBanner.onClose).toEqual(closeBanner);
        expect(out.successBanner.show).toEqual(showSuccess);
      });
      test('message', () => {
        expect(out.successBanner.text).toEqual(formatMessage(messages.editSuccessAlert));
      });
    });
    describe('gradeFilter', () => {
      it.each([
        ['all limits are valid', validity, validity, []],
        ['course min is invalid', validity, { ...validity, isMinValid: false }, ['minGradeInvalid']],
        ['course min and max are invalid', validity, { ...validity, isMinValid: false, isMaxValid: false }, ['minGradeInvalid', 'maxGradeInvalid']],
        ['course min is greater than max', validity, { ...validity, isRangeValid: false }, ['courseGradeRangeInvalid']],
        ['assignment min is invalid', { ...validity, isMinValid: false }, validity, ['minAssignmentGradeInvalid']],
        ['assignment max is invalid', { ...validity, isMaxValid: false }, validity, ['maxAssignmentGradeInvalid']],
        ['assignment min is greater than max', { ...validity, isRangeValid: false }, validity, ['assignmentGradeRangeInvalid']],
        ['assignment and course limits are invalid', { ...validity, isMinValid: false }, { ...validity, isMaxValid: false }, ['minAssignmentGradeInvalid', 'maxGradeInvalid']],
      ])('when %s', (_, assignmentValidity, courseValidity, expected) => {
        selectors.app.useAssignmentGradeFilterValidity.mockReturnValueOnce(assignmentValidity);
        selectors.app.useCourseGradeFilterValidity.mockReturnValueOnce(courseValidity);
        out = useStatusAlertsData();
        expect(out.gradeFilter.messages).toEqual(expected.map((key) => formatMessage(messages[key])));
        expect(out.gradeFilter.show).toEqual(expected.length > 0);
      });
      it('ignores invalid assignment limits when no assignment is selected', () => {
        selectors.filters.useSelectedAssignmentLabel.mockReturnValueOnce(null);
        selectors.app.useAssignmentGradeFilterValidity.mockReturnValueOnce({ ...validity, isMinValid: false });
        out = useStatusAlertsData();
        expect(out.gradeFilter.messages).toEqual([]);
        expect(out.gradeFilter.show).toEqual(false);
      });
    });
  });
});
