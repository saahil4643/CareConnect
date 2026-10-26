import React from 'react';
import { AssistanceRequestForm } from '../../components/forms/AssistanceRequestForm';

export const RequestHelpPage: React.FC = () => {
  return (
    <div className="py-2">
      <AssistanceRequestForm isForFamilyRelative={false} />
    </div>
  );
};
