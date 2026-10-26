import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'normal' | 'large';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  toggleTextSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = localStorage.getItem('careconnect_text_size');
    return (saved === 'large' || saved === 'normal') ? saved : 'normal';
  });

  useEffect(() => {
    localStorage.setItem('careconnect_text_size', textSize);
    if (textSize === 'large') {
      document.body.classList.add('text-size-large');
    } else {
      document.body.classList.remove('text-size-large');
    }
  }, [textSize]);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
  };

  const toggleTextSize = () => {
    setTextSizeState(prev => (prev === 'normal' ? 'large' : 'normal'));
  };

  return (
    <AccessibilityContext.Provider value={{ textSize, setTextSize, toggleTextSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
