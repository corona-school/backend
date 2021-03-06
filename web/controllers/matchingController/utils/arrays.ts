/// Takes the given array and filters that array according to the specified filters.
/// An element is not included in the returning array of this function, iff there is none of the given filters that returns true for this element.
/// If filters is null/undefined, no filters are applied and the array is returned unchanged.
export function filterWithMultipleFilters<T>(arr: T[], filters: ((f: T) => boolean)[]): T[] {
    if (!filters) {
        return arr; //no filtering is applied
    }
    const compoundFilter = (e: T) => {
        if (filters.every(f => f(e) === false)) {
            return false;
        }
        return true;
    };

    return arr.filter(compoundFilter);
}