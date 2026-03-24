import { categoriesService } from '../categories-service';
import { supabase } from '@/src/utils/supabase';

describe('CategoriesService', () => {
  const mockCategory = {
    name: 'Test Category',
    type: 'expense' as const,
    color: '#FF0000',
    icon: 'shopping-cart',
    user_id: 'user-123',
    is_default: false,
    is_active: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all categories', async () => {
    const mockData = [{ id: '1', ...mockCategory }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await categoriesService.getAll();

    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch category by id', async () => {
    const mockData = { id: '1', ...mockCategory };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await categoriesService.getById('1');

    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(result.data).toEqual(mockData);
  });

  it('should create a category', async () => {
    const mockData = { id: '1', ...mockCategory };
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await categoriesService.create(mockCategory);

    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(result.data).toEqual(mockData);
  });

  it('should update a category', async () => {
    const updateData = { name: 'Updated Name' };
    const mockData = { id: '1', ...mockCategory, ...updateData };
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await categoriesService.update('1', updateData);

    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(result.data).toEqual(mockData);
  });

  it('should delete a category', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await categoriesService.delete('1');

    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(result.error).toBeNull();
  });
});
