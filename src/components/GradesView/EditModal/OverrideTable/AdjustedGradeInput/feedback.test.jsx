import React from 'react';
import { render, screen } from '@testing-library/react';

import useAdjustedGradeInputData from './hooks';
import AdjustedGradeInput from '.';

jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const hookProps = {
  value: 'abc',
  onChange: jest.fn(),
  hintText: ' / 20',
  isInvalid: true,
  feedback: { type: 'invalid', text: 'test-error' },
};

describe('AdjustedGradeInput feedback', () => {
  it('marks the control invalid and describes it with the error message', () => {
    useAdjustedGradeInputData.mockReturnValue(hookProps);
    render(<AdjustedGradeInput />);
    const control = screen.getByRole('textbox', { description: 'test-error' });
    expect(control.getAttribute('aria-invalid')).toEqual('true');
    expect(control.getAttribute('aria-required')).toEqual('true');
  });
  it('announces the message through a live region that exists before the message appears', () => {
    useAdjustedGradeInputData.mockReturnValue({ ...hookProps, isInvalid: false, feedback: null });
    const { container, rerender } = render(<AdjustedGradeInput />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion.textContent).toEqual('');
    useAdjustedGradeInputData.mockReturnValue(hookProps);
    rerender(<AdjustedGradeInput />);
    expect(container.querySelector('[aria-live="polite"]')).toBe(liveRegion);
    expect(liveRegion.textContent).toContain('test-error');
  });
});
