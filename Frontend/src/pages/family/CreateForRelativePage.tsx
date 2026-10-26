import React from 'react';
import { AssistanceRequestForm } from '../../components/forms/AssistanceRequestForm';

export const CreateForRelativePage: React.FC = () => {
  return (
    <div className="py-2">
      <AssistanceRequestForm isForFamilyRelative={true} />
    </div>
  );
};
