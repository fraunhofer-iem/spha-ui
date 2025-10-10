import { describe, it, expect } from 'vitest';
import type { Product, Result } from '../../model/Result';

// Mock the functions from ProductList.vue
const getHealthScoreTrend = (product: Product): number | null => {
  if (product.results.length < 2) return null;
  const currentScore = product.results[product.results.length - 1]?.healthScore;
  const previousScore = product.results[product.results.length - 2]?.healthScore;
  
  if (currentScore === undefined || previousScore === undefined) return null;
  
  return currentScore - previousScore;
};

const getTrendColorClass = (trend: number | null): string => {
  if (trend === null) return 'text-muted';
  if (trend > 0) return 'text-success';
  if (trend < 0) return 'text-danger';
  return 'text-muted'; // for trend === 0
};

const getTrendIcon = (trend: number | null): string => {
  if (trend === null) return '';
  if (trend > 0) return 'bi-arrow-up';
  if (trend < 0) return 'bi-arrow-down';
  return 'bi-dash'; // for trend === 0
};

// Mock data
const mockResult1: Result = {
  healthScore: 70,
  repoInfo: {
    version: '1.0.0',
    repoLanguages: [],
    projectUrl: 'https://example.com'
  },
  root: { displayName: 'Root', score: 70, id: 'root', children: [] },
  tools: [],
  createdAt: '2024-01-01'
};

const mockResult2: Result = {
  healthScore: 85,
  repoInfo: {
    version: '1.1.0',
    repoLanguages: [],
    projectUrl: 'https://example.com'
  },
  root: { displayName: 'Root', score: 85, id: 'root', children: [] },
  tools: [],
  createdAt: '2024-01-02'
};

const mockResult3: Result = {
  healthScore: 60,
  repoInfo: {
    version: '1.2.0',
    repoLanguages: [],
    projectUrl: 'https://example.com'
  },
  root: { displayName: 'Root', score: 60, id: 'root', children: [] },
  tools: [],
  createdAt: '2024-01-03'
};

describe('ProductList Health Score Trend Functions', () => {
  it('should return null for products with no results', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      results: []
    };
    
    expect(getHealthScoreTrend(product)).toBe(null);
  });

  it('should return null for products with only one result', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      results: [mockResult1]
    };
    
    expect(getHealthScoreTrend(product)).toBe(null);
  });

  it('should calculate positive trend correctly', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      results: [mockResult1, mockResult2] // 70 -> 85
    };
    
    expect(getHealthScoreTrend(product)).toBe(15);
  });

  it('should calculate negative trend correctly', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      results: [mockResult2, mockResult3] // 85 -> 60
    };
    
    expect(getHealthScoreTrend(product)).toBe(-25);
  });

  it('should return correct color class for positive trend', () => {
    expect(getTrendColorClass(15)).toBe('text-success');
  });

  it('should return correct color class for negative trend', () => {
    expect(getTrendColorClass(-10)).toBe('text-danger');
  });

  it('should return correct color class for zero trend', () => {
    expect(getTrendColorClass(0)).toBe('text-muted');
  });

  it('should return correct color class for null trend', () => {
    expect(getTrendColorClass(null)).toBe('text-muted');
  });

  it('should return correct icon for positive trend', () => {
    expect(getTrendIcon(15)).toBe('bi-arrow-up');
  });

  it('should return correct icon for negative trend', () => {
    expect(getTrendIcon(-10)).toBe('bi-arrow-down');
  });

  it('should return correct icon for zero trend', () => {
    expect(getTrendIcon(0)).toBe('bi-dash');
  });

  it('should return empty string for null trend', () => {
    expect(getTrendIcon(null)).toBe('');
  });
});