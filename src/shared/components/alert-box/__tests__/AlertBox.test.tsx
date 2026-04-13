import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AlertBox } from '../index';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useTheme } from '@/src/core/theme/theme.hooks';

jest.mock('@/src/shared/hooks/use-alert-box');
jest.mock('@/src/core/theme/theme.hooks');

describe('AlertBox', () => {
  const mockSetIsVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        overlay: 'rgba(0,0,0,0.5)',
        surface: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        primary: '#006239',
        background: '#FFFFFF',
      },
    });
  });

  it('should not render when not visible', () => {
    (useAlertBoxStore as unknown as jest.Mock).mockReturnValue({
      isVisible: false,
      message: '',
      setIsVisible: mockSetIsVisible,
    });

    const { queryByText } = render(<AlertBox />);
    expect(queryByText('Atenção')).toBeNull();
  });

  it('should render correct message when visible', () => {
    (useAlertBoxStore as unknown as jest.Mock).mockReturnValue({
      isVisible: true,
      message: 'Test Error Message',
      setIsVisible: mockSetIsVisible,
    });

    const { getByText } = render(<AlertBox />);
    expect(getByText('Atenção')).toBeTruthy();
    expect(getByText('Test Error Message')).toBeTruthy();
  });

  it('should call setIsVisible(false) when OK button is pressed', () => {
    (useAlertBoxStore as unknown as jest.Mock).mockReturnValue({
      isVisible: true,
      message: 'Test Error Message',
      setIsVisible: mockSetIsVisible,
    });

    const { getByText } = render(<AlertBox />);
    const okButton = getByText('OK');

    fireEvent.press(okButton);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
  });
});
