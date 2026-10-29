import React from 'react';

import { Alert } from '@openedx/paragon';

import useStatusAlertsData from './hooks';

export const StatusAlerts = () => {
  const {
    successBanner,
    gradeFilter,
  } = useStatusAlertsData();

  return (
    <>
      <Alert
        variant="success"
        onClose={successBanner.onClose}
        show={successBanner.show}
      >
        {successBanner.text}
      </Alert>
      <Alert
        variant="danger"
        dismissible={false}
        show={gradeFilter.show}
      >
        {gradeFilter.messages.map((message) => <div key={message}>{message}</div>)}
      </Alert>
    </>
  );
};

StatusAlerts.propTypes = {};

export default StatusAlerts;
