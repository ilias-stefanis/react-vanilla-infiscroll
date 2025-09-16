import { useEffect, useState } from "react";
import {
    peopleSchema,
    type PeopleArrayType,
} from "../common/schemas";


import { getPeople, type apiReturnType } from "../utils/api";
import type { paginationStateType } from '../common/types';

export type usePeopleReturnType = {
    people: PeopleArrayType;
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
};

function usePeopleData(currentState: paginationStateType): usePeopleReturnType {
    const [people, setPeopleList] = useState<PeopleArrayType>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { page, filterLastName, filterLanguage } = currentState;

    useEffect(() => {
        let isCanceled = false;

        setIsLoading(true);
        setError(null);

        const fetchPeople = async () => {
            const data: apiReturnType = await getPeople({
                page,
                filterLastName,
                filterLanguage,
            });

            // in case the component unmounted while we were waiting for the data, or a new request was made
            if (isCanceled) {
                return;
            }

            if ("error" in data) {
                setError(data.error);
                setIsLoading(false);
                setHasMore(false);
                return;
            }

            // while in this case data should always be valid, normally we should validate every incoming requested data
            const parsedData = peopleSchema.safeParse(data);


            if (!parsedData.success) {
                console.error(`Data validation error: ${parsedData.error}`);
                setError(`Data validation error: ${parsedData.error}`);

                setIsLoading(false);
                return;
            }

            const parsedPeople = parsedData.data;

            if (parsedPeople.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            // if we are loading the first page, we replace the list (this happens on filter change)
            if (page === 1) {

                setPeopleList(parsedPeople);
                setIsLoading(false);
                return;
            }

            setPeopleList((prevPeople: PeopleArrayType): PeopleArrayType => {
                // assuming no duplicates in the data source, and that no new entries are added while paginating.
                return [...prevPeople, ...parsedPeople];
            });

            setIsLoading(false);
        };

        fetchPeople();

        // cleanup function in case the component unmounts or the effect is re-run
        return () => {
            isCanceled = true;
        };
    }, [page, filterLastName, filterLanguage]);

    return { people, isLoading, hasMore, error };
}

export { usePeopleData };
