import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ThemedInput from '../ThemedInput';
import { useTheme } from '@/src/core/theme/theme.hooks';

jest.mock('@/src/core/theme/theme.hooks');

describe('ThemedInput', () => {
  const mockOnChangeText = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        surfaceVariant: '#F5F5F5',
        border: '#E0E0E0',
        danger: '#FF0000',
      },
    });
  });

  it('should render correctly with label and value', () => {
    const { getByText, getByDisplayValue } = render(
      <ThemedInput 
        label="Username" 
        value="testuser" 
        onChangeText={mockOnChangeText} 
      />
    );

    expect(getByText('USERNAME')).toBeTruthy();
    expect(getByDisplayValue('testuser')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const { getByDisplayValue } = render(
      <ThemedInput 
        value="testuser" 
        onChangeText={mockOnChangeText} 
      />
    );

    const input = getByDisplayValue('testuser');
    fireEvent.changeText(input, 'newuser');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('newuser');
  });

  it('should render error message when provided', () => {
    const { getByText } = render(
      <ThemedInput 
        value="" 
        onChangeText={mockOnChangeText} 
        error="Field is required" 
      />
    );

    expect(getByText('Field is required')).toBeTruthy();
  });

  it('should render rightElement when provided', () => {
    const { getByTestId } = render(
      <ThemedInput 
        value="" 
        onChangeText={mockOnChangeText} 
        rightElement={<View testID="right-element" />} 
      />
    );

    expect(getByTestId('right-element')).toBeTruthy();
  });
});
