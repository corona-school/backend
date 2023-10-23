import { FormulaFunction } from './types';

// Formula is a function to calculate the event value. The event value is needed later for aggregation and subsequent evaluation.
export type Formula = {
    function: FormulaFunction;
};

const formulas: Map<string, Formula> = new Map();
