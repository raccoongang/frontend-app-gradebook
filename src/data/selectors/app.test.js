// import * in order to mock in-file references
import * as selectors from './app';
// import default export in order to test simpleSelectors not exported individually
import exportedSelectors from './app';

const testState = {
  app: {
    courseId: 'Just',
    filters: {
      assignmentGradeMax: 'keep',
      assignmentGradeMin: 'swiming',
      courseGradeMax: 'just',
      courseGradeMin: 'keep',
    },
    modalState: {
      open: 'swimming',
      adjustedGradePossible: 'what',
      adjustedGradeValue: 'do',
      assignmentName: 'we',
      reasonForChange: 'do',
      todaysDate: 'we',
      updateModuleId: 'swim',
      updateUserId: 'swim',
      updateUsername: 'swim',
    },
    searchValue: 'blub blub',
  },
};

const testVal = 'some Test Value';

describe('app selectors', () => {
  describe('assignmentGradeLimits', () => {
    it('loads assignmentGradeMin/Max from filters', () => {
      expect(exportedSelectors.assignmentGradeLimits(testState)).toEqual({
        assignmentGradeMax: testState.app.filters.assignmentGradeMax,
        assignmentGradeMin: testState.app.filters.assignmentGradeMin,
      });
    });
  });
  describe('assignmentGradeFilterValidity', () => {
    it.each([
      ['0', '100', true, true, true],
      ['110', '5000', true, true, true],
      ['80', '80', true, true, true],
      ['-1', '100', false, true, true],
      ['0', '-1', true, false, true],
      ['', '', false, false, true],
      ['80', '10', true, true, false],
      ['-0.5', '100', false, true, true],
      ['50.9', '50.1', true, true, false],
      ['1e3', '100', true, true, false],
    ])('for min %p and max %p returns isMinValid %p, isMaxValid %p, isRangeValid %p (no upper bound)', (assignmentGradeMin, assignmentGradeMax, isMinValid, isMaxValid, isRangeValid) => {
      expect(selectors.assignmentGradeFilterValidity({
        app: { filters: { assignmentGradeMin, assignmentGradeMax } },
      })).toEqual({ isMinValid, isMaxValid, isRangeValid });
    });
  });
  describe('courseGradeFilterValidity', () => {
    it.each([
      ['0', '100', true, true, true],
      ['0', '-1', true, false, true],
      ['-1', '0', false, true, true],
      ['101', '100', false, true, true],
      ['100', '101', true, false, true],
      ['', '', false, false, true],
      ['80', '10', true, true, false],
      ['100.5', '100', false, true, true],
      ['0.5', '99.5', true, true, true],
    ])('for min %p and max %p returns isMinValid %p, isMaxValid %p, isRangeValid %p (0 to 100, inclusive)', (courseGradeMin, courseGradeMax, isMinValid, isMaxValid, isRangeValid) => {
      expect(selectors.courseGradeFilterValidity({
        app: { filters: { courseGradeMin, courseGradeMax } },
      })).toEqual({ isMinValid, isMaxValid, isRangeValid });
    });
  });
  describe('courseGradeLimits', () => {
    it('loads courseGradeMin/Max from filters', () => {
      expect(exportedSelectors.courseGradeLimits(testState)).toEqual({
        courseGradeMax: testState.app.filters.courseGradeMax,
        courseGradeMin: testState.app.filters.courseGradeMin,
      });
    });
  });
  describe('editUpdateData', () => {
    it('loads grade, usage_id, and user_id from modalState', () => {
      expect(exportedSelectors.editUpdateData(testState)).toEqual([{
        grade: {
          comment: testState.app.modalState.reasonForChange,
          earned_graded_override: testState.app.modalState.adjustedGradeValue,
        },
        usage_id: testState.app.modalState.updateModuleId,
        user_id: testState.app.modalState.updateUserId,
      }]);
    });
  });
  describe.each([
    ['areAssignmentGradeFiltersValid', 'assignmentGradeFilterValidity'],
    ['areCourseGradeFiltersValid', 'courseGradeFilterValidity'],
  ])('%s', (selectorName, validityName) => {
    it.each([
      [false, true, true, false],
      [true, false, true, false],
      [true, true, false, false],
      [true, true, true, true],
    ])('with isMinValid %p, isMaxValid %p and isRangeValid %p returns %p', (isMinValid, isMaxValid, isRangeValid, expected) => {
      const old = selectors[validityName];
      selectors[validityName] = jest.fn(() => ({ isMinValid, isMaxValid, isRangeValid }));
      expect(exportedSelectors[selectorName](testState)).toEqual(expected);
      selectors[validityName] = old;
    });
  });

  describe('filterMenu', () => {
    describe('isClosed', () => {
      const testSelector = (open, transitioning, expected) => {
        expect(exportedSelectors.filterMenu.isClosed({
          app: { filterMenu: { open, transitioning } },
        })).toEqual(expected);
      };
      it('returns true if filterMenu is !open and !transitioning', () => {
        testSelector(false, false, true);
      });
      it('returns false if filterMenu is not (!open and !transitioning)', () => {
        testSelector(true, false, false);
        testSelector(false, true, false);
        testSelector(true, true, false);
      });
    });
    describe('isOpening', () => {
      const testSelector = (open, transitioning, expected) => {
        expect(exportedSelectors.filterMenu.isOpening({
          app: { filterMenu: { open, transitioning } },
        })).toEqual(expected);
      };
      it('returns true if filter menu is transitioning AND open', () => {
        testSelector(true, true, true);
      });
      it('returns true if filter menu is not (transitioning AND open)', () => {
        testSelector(false, false, false);
        testSelector(true, false, false);
        testSelector(false, true, false);
      });
    });
    describe('simpleSelectors', () => {
      const testFilterMenuSelector = (key) => {
        test(key, () => {
          expect(
            exportedSelectors.filterMenu[key]({ app: { filterMenu: { [key]: testVal } } }),
          ).toEqual(testVal);
        });
      };
      testFilterMenuSelector('open');
      testFilterMenuSelector('transitioning');
    });
  });
  describe('modalSelectors', () => {
    const testModalSelector = (key) => {
      test(key, () => {
        expect(
          exportedSelectors.modalState[key]({ app: { modalState: { [key]: testVal } } }),
        ).toEqual(testVal);
      });
    };
    testModalSelector('assignmentName');
    testModalSelector('adjustedGradePossible');
    testModalSelector('adjustedGradeValue');
    testModalSelector('open');
    testModalSelector('reasonForChange');
    testModalSelector('todaysDate');
    testModalSelector('updateUserName');
  });
  describe('simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      test(key, () => {
        expect(exportedSelectors[key]({ app: { [key]: testVal } })).toEqual(testVal);
      });
    };
    testSimpleSelector('activeView');
    testSimpleSelector('courseId');
    testSimpleSelector('filters');
    testSimpleSelector('searchValue');
    testSimpleSelector('showImportSuccessToast');
  });
});
