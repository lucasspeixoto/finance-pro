import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
  it('should format a positive number to BRL currency string', () => {
    const value = 150.5;
    // Note: Intl.NumberFormat localized output can vary slightly in different environments (e.g. space vs non-breaking space)
    // We'll use a regex or check for the presence of the currency symbol and the value.
    const result = formatCurrency(value);
    expect(result).toMatch(/R\$\s?150,50/);
  });

  it('should format a negative number to BRL currency string', () => {
    const value = -50;
    const result = formatCurrency(value);
    expect(result).toMatch(/-R\$\s?50,00/);
  });

  it('should format zero correctly', () => {
    const value = 0;
    const result = formatCurrency(value);
    expect(result).toMatch(/R\$\s?0,00/);
  });
});
