import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { registerAllMetrics } from './metrics';
import { Metric } from './types';

// Maps A | B to A & B (using contra-variant position - c.f. https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Derives the context for a given list of ActionIDs
type ContextForActions<ActionIDs extends ActionID[]> = UnionToIntersection<
    // By using UnionToIntersection, it combines specific contexts for the provided ActionIDs
    // Creating a union of all specific contexts for the given ActionIDs
    { [Index in keyof ActionIDs]: SpecificNotificationContext<ActionIDs[Index]> }[number]
>;

// This function utilizes generics to ensure flexibility in the ActionIDs and their respective contexts, allowing for dynamic metric creation.
function createMetric<T extends ActionID[], K extends ContextForActions<T>>(metricName: string, onActions: T, formula: (context: K) => number): Metric {
    return {
        metricName,
        onActions,
        formula,
    };
}

const batchOfMetrics = [
    createMetric('student_onboarding_registered', ['student_registration_started'], (context) => {
        return 1;
    }),
];

registerAllMetrics(batchOfMetrics);
