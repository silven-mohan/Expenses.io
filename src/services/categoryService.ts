import { db } from '@db/index';
import type { Category } from '@/types';
import { generateId } from '@utils/helpers';

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await db.categories.toArray();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    return await db.categories.get(id);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw error;
  }
}

export async function createCategory(name: string, type: 'expense' | 'income' = 'expense'): Promise<Category> {
  const category: Category = {
    id: generateId(),
    name,
    type,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    await db.categories.add(category);
    return category;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt'>>
): Promise<Category | undefined> {
  try {
    const category = await db.categories.get(id);
    if (!category) throw new Error('Category not found');

    const updated: Category = {
      ...category,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.categories.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await db.categories.delete(id);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}
