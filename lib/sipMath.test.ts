import { describe, it, expect } from 'vitest';
import {
  calculateSIPFutureValue,
  calculateCorpusGrowth,
  calculateTotalCorpus,
  compareScenarios,
  formatIndianNumber,
  formatCurrency,
} from './sipMath';

describe('SIP Math Engine', () => {
  describe('calculateSIPFutureValue', () => {
    it('should calculate future value correctly for 12% annual return', () => {
      // ₹10,000/month for 10 years at 12% p.a.
      const fv = calculateSIPFutureValue(10000, 12, 120);
      // Expected: approximately ₹23.23 lakh
      expect(fv).toBeGreaterThan(2300000);
      expect(fv).toBeLessThan(2350000);
    });

    it('should return 0 when monthly amount is 0', () => {
      const fv = calculateSIPFutureValue(0, 12, 120);
      expect(fv).toBe(0);
    });

    it('should return sum of investments when return is 0%', () => {
      const fv = calculateSIPFutureValue(10000, 0, 12);
      expect(fv).toBe(120000); // 10000 * 12
    });
  });

  describe('calculateCorpusGrowth', () => {
    it('should calculate corpus growth correctly', () => {
      // ₹2.8 lakh growing at 12% for 10 years
      const fv = calculateCorpusGrowth(280000, 12, 120);
      // Expected: approximately ₹9.2 lakh
      expect(fv).toBeGreaterThan(900000);
      expect(fv).toBeLessThan(950000);
    });

    it('should return original corpus when months is 0', () => {
      const fv = calculateCorpusGrowth(280000, 12, 0);
      expect(fv).toBe(280000);
    });
  });

  describe('compareScenarios', () => {
    it('should show cancel scenario has largest loss', () => {
      const comparison = compareScenarios(
        {
          monthlyAmount: 10000,
          currentCorpus: 280000,
          yearsToGoal: 10,
          assumedAnnualReturn: 12,
        },
        5000000, // ₹50 lakh goal
        6, // 6 month pause
        5000 // reduce to ₹5000
      );

      // Cancel should have the largest delta (most negative)
      expect(comparison.cancel.deltaVsContinue).toBeLessThan(comparison.pause.deltaVsContinue);
      expect(comparison.cancel.deltaVsContinue).toBeLessThan(comparison.reduce.deltaVsContinue);
      
      // Continue should have 0 delta
      expect(comparison.continue.deltaVsContinue).toBe(0);
      
      // All deltas should be negative except continue
      expect(comparison.pause.deltaVsContinue).toBeLessThan(0);
      expect(comparison.reduce.deltaVsContinue).toBeLessThan(0);
      expect(comparison.cancel.deltaVsContinue).toBeLessThan(0);
    });

    it('should calculate goal percentages correctly', () => {
      const comparison = compareScenarios(
        {
          monthlyAmount: 10000,
          currentCorpus: 280000,
          yearsToGoal: 10,
          assumedAnnualReturn: 12,
        },
        5000000
      );

      // Continue scenario should get closest to 100% of goal
      expect(comparison.continue.percentOfGoal).toBeGreaterThan(60);
      expect(comparison.cancel.percentOfGoal).toBeLessThan(comparison.continue.percentOfGoal);
    });

    it('should handle edge case: already at goal', () => {
      const comparison = compareScenarios(
        {
          monthlyAmount: 10000,
          currentCorpus: 5000000,
          yearsToGoal: 1,
          assumedAnnualReturn: 12,
        },
        5000000
      );

      // All scenarios should exceed 100% of goal
      expect(comparison.continue.percentOfGoal).toBeGreaterThan(100);
      expect(comparison.cancel.percentOfGoal).toBeGreaterThan(100);
    });
  });

  describe('formatIndianNumber', () => {
    it('should format in Crores correctly', () => {
      expect(formatIndianNumber(50000000)).toBe('5.00 Cr');
      expect(formatIndianNumber(12500000)).toBe('1.25 Cr');
    });

    it('should format in Lakhs correctly', () => {
      expect(formatIndianNumber(500000)).toBe('5.00 Lakh');
      expect(formatIndianNumber(2800000)).toBe('28.00 Lakh');
    });

    it('should format smaller numbers with Indian commas', () => {
      expect(formatIndianNumber(50000)).toBe('50,000');
      expect(formatIndianNumber(1234)).toBe('1,234');
    });
  });

  describe('formatCurrency', () => {
    it('should prepend rupee symbol', () => {
      expect(formatCurrency(500000)).toBe('₹5.00 Lakh');
      expect(formatCurrency(50000)).toBe('₹50,000');
    });
  });
});
