import React from 'react';

import { Form } from '@openedx/paragon';

import useAdjustedGradeInputData from './hooks';

/**
 * <AdjustedGradeInput />
 * Input control for adjusting the grade of a unit
 * displays an "/ ${possibleGrade}" if there is one in the data model,
 * and an error or warning message if the entered grade fails validation.
 */
export const AdjustedGradeInput = () => {
  const {
    value,
    onChange,
    hintText,
    isInvalid,
    feedback,
  } = useAdjustedGradeInputData();
  return (
    <Form.Group className="mb-0" isInvalid={isInvalid}>
      <span>
        <Form.Control
          type="text"
          name="adjustedGradeValue"
          value={value}
          onChange={onChange}
          aria-invalid={isInvalid}
          aria-required
        />
        {hintText}
      </span>
      <div aria-live="polite">
        {feedback && (
          <Form.Control.Feedback type={feedback.type}>
            {feedback.text}
          </Form.Control.Feedback>
        )}
      </div>
    </Form.Group>
  );
};

AdjustedGradeInput.propTypes = {};

export default AdjustedGradeInput;
