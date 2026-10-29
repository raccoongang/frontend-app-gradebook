import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import PercentGroup from '../PercentGroup';
import useAssignmentGradeFilterData from './hooks';
import AssignmentFilter from '.';

jest.mock('../PercentGroup', () => 'PercentGroup');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const hookData = {
  handleChange: jest.fn(),
  handleSetMax: jest.fn(),
  handleSetMin: jest.fn(),
  selectedAssignment: 'test-assignment',
  isApplyDisabled: false,
  assignmentGradeMax: 300,
  assignmentGradeMin: 23,
};
useAssignmentGradeFilterData.mockReturnValue(hookData);

const updateQueryParams = jest.fn();

let el;
describe('AssignmentFilter component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<AssignmentFilter updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useAssignmentGradeFilterData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    describe('with selected assignment', () => {
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      it('renders a PercentGroup for both Max and Min filters', () => {
        let { props } = el.instance.findByType(PercentGroup)[0];
        expect(props.value).toEqual(hookData.assignmentGradeMin);
        expect(props.max).toEqual(null);
        expect(props.disabled).toEqual(false);
        expect(props.onChange).toEqual(hookData.handleSetMin);
        props = el.instance.findByType(PercentGroup)[1].props;
        expect(props.value).toEqual(hookData.assignmentGradeMax);
        expect(props.max).toEqual(null);
        expect(props.disabled).toEqual(false);
        expect(props.onChange).toEqual(hookData.handleSetMax);
      });
      it('renders a submit button', () => {
        const { props } = el.instance.findByType(Button)[0];
        expect(props.disabled).toEqual(false);
        expect(props.onClick).toEqual(hookData.handleSubmit);
      });
    });
    describe('with invalid limits', () => {
      it('disables the submit button only', () => {
        useAssignmentGradeFilterData.mockReturnValueOnce({ ...hookData, isApplyDisabled: true });
        el = shallow(<AssignmentFilter updateQueryParams={updateQueryParams} />);
        expect(el.instance.findByType(Button)[0].props.disabled).toEqual(true);
        el.instance.findByType(PercentGroup).forEach(({ props }) => {
          expect(props.disabled).toEqual(false);
        });
      });
    });
    describe('without selected assignment', () => {
      beforeEach(() => {
        useAssignmentGradeFilterData.mockReturnValueOnce({
          ...hookData,
          selectedAssignment: null,
          isApplyDisabled: true,
        });
        el = shallow(<AssignmentFilter updateQueryParams={updateQueryParams} />);
      });
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      it('disables controls', () => {
        let { props } = el.instance.findByType(PercentGroup)[0];
        expect(props.disabled).toEqual(true);
        props = el.instance.findByType(PercentGroup)[1].props;
        expect(props.disabled).toEqual(true);
      });
    });
  });
});
