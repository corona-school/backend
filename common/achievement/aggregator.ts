import { AggregatorFunction } from './types';

// Aggregators are needed to aggregate `EventValues` or `Buckets` for evaluation (like sum, count, max, min, avg)
const aggregators: Map<string, AggregatorFunction> = new Map();
