async function zoomRetry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return zoomRetry(fn, retries - 1, delay);
        } else {
            throw error;
        }
    }
}

export default zoomRetry;
