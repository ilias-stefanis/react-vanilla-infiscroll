import { useState, useEffect } from "react";

/**
 * useDebounce hook - generic version
 * @param value - any type of value to debounce
 * @param delay - debounce delay in ms
 * @returns debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
