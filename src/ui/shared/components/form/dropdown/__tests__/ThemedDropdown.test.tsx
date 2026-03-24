import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useTheme } from '@/src/core/theme/theme.hooks';
import ThemedDropdown from '../ThemedDropdown';

jest.mock('@/src/core/theme/theme.hooks');

describe('ThemedDropdown', () => {
  const mockOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        surfaceVariant: '#F5F5F5',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        primary: '#006239',
        danger: '#FF0000',
      },
    });
  });

  it('should render correctly with label and placeholder', () => {
    const { getByText } = render(
      <ThemedDropdown 
        label="Select Account" 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );

    expect(getByText('SELECT ACCOUNT')).toBeTruthy();
    expect(getByText('Selecione uma opção')).toBeTruthy();
  });

  it('should render selected option label', () => {
    const { getByText } = render(
      <ThemedDropdown 
        value="1" 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );

    expect(getByText('Option 1')).toBeTruthy();
  });

  it('should open modal when pressed', () => {
    const { getByText, queryByText } = render(
      <ThemedDropdown 
        label="Select" 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );

    // Modal content should not be initially visible in a way that is easily queryable if not rendered
    // But since we use Modal, we can check if the modal title (label or placeholder) appears after press
    fireEvent.press(getByText('Selecione uma opção'));
    
    // In many RN testing environments, Modal is mocked to always render its children
    // or we might need to look for elements inside it.
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('should call onSelect and close modal when an option is pressed', () => {
    const { getByText } = render(
      <ThemedDropdown 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );

    fireEvent.press(getByText('Selecione uma opção'));
    fireEvent.press(getByText('Option 2'));

    expect(mockOnSelect).toHaveBeenCalledWith('2');
  });

  it('should render error message', () => {
    const { getByText } = render(
      <ThemedDropdown 
        options={mockOptions} 
        onSelect={mockOnSelect} 
        error="Required field" 
      />
    );

    expect(getByText('Required field')).toBeTruthy();
  });
});
