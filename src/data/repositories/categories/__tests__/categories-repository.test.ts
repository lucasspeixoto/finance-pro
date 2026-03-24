import { categoriesRepository } from '../categories-repository';
import { categoriesService } from '@/src/data/services/categories/categories-service';

jest.mock('@/src/data/services/categories/categories-service');

describe('CategoriesRepository', () => {
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

  it('should call categoriesService.getAll', async () => {
    const mockData = [{ id: '1', ...mockCategory, created_at: new Date().toISOString() }];
    (categoriesService.getAll as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await categoriesRepository.getAll();

    expect(categoriesService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
  });

  it('should call categoriesService.getById', async () => {
    const mockData = { id: '1', ...mockCategory, created_at: new Date().toISOString() };
    (categoriesService.getById as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await categoriesRepository.getById('1');

    expect(categoriesService.getById).toHaveBeenCalledWith('1');
    expect(result.data).toEqual(mockData);
  });

  it('should call categoriesService.create', async () => {
    (categoriesService.create as jest.Mock).mockResolvedValue({ error: null });

    await categoriesRepository.create(mockCategory);

    expect(categoriesService.create).toHaveBeenCalledWith(mockCategory);
  });

  it('should call categoriesService.update', async () => {
    const updateData = { name: 'Updated' };
    (categoriesService.update as jest.Mock).mockResolvedValue({ error: null });

    await categoriesRepository.update('1', updateData);

    expect(categoriesService.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should call categoriesService.delete', async () => {
    (categoriesService.delete as jest.Mock).mockResolvedValue({ error: null });

    await categoriesRepository.delete('1');

    expect(categoriesService.delete).toHaveBeenCalledWith('1');
  });
});
