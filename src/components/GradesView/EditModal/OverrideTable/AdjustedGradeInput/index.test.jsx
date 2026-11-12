import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Form } from '@openedx/paragon';

import useAdjustedGradeInputData from './hooks';
import AdjustedGradeInput from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  hintText: 'some-hint-text',
  onChange: jest.fn().mockName('hook.onChange'),
  value: 'test-value',
  isInvalid: false,
  feedback: null,
};
useAdjustedGradeInputData.mockReturnValue(hookProps);

let el;
describe('AdjustedGradeInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<AdjustedGradeInput />);
  });
  describe('behavior', () => {
    it('initializes hook data', () => {
      expect(useAdjustedGradeInputData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
      const control = el.instance.findByType(Form.Control)[0];
      expect(control.props.value).toEqual(hookProps.value);
      expect(control.props.onChange).toEqual(hookProps.onChange);
      expect(control.props['aria-required']).toEqual(true);
      expect(el.instance.findByType('span')[0].children[1].el).toContain(hookProps.hintText);
      expect(el.instance.findByType(Form.Control.Feedback)).toHaveLength(0);
    });
    describe.each([
      ['invalid', true],
      ['warning', false],
    ])('with %s feedback', (type, isInvalid) => {
      const feedback = { type, text: `test-${type}` };
      beforeEach(() => {
        useAdjustedGradeInputData.mockReturnValueOnce({ ...hookProps, isInvalid, feedback });
        el = shallow(<AdjustedGradeInput />);
      });
      it('passes isInvalid to the group and the control', () => {
        expect(el.instance.findByType(Form.Group)[0].props.isInvalid).toEqual(isInvalid);
        expect(el.instance.findByType(Form.Control)[0].props['aria-invalid']).toEqual(isInvalid);
      });
      it('renders the feedback message with its type', () => {
        const message = el.instance.findByType(Form.Control.Feedback)[0];
        expect(message.props.type).toEqual(type);
        expect(message.children[0].el).toEqual(feedback.text);
      });
    });
  });
});
