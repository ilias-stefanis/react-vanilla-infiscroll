import React, { useState, useEffect } from "react";
import PersonList from "./components/PersonList";
import Filter from "./components/Filter";
import { getPeople, type apiReturnType } from "./utils/api";
import useDebounce from "./hooks/useDebounce";
import "./index.css";
import "./App.css";
import { peopleSchema, type SinglePersonType } from "./common/schemas";

const App = () => {
    const [people, setPeople] = useState<Array<SinglePersonType>>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Read initial filter state from URL on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const initialLastName = urlParams.get("lastName") || "";
    const initialLanguage = urlParams.get("language") || "";

    // Filter state
    const [lastNameFilter, setLastNameFilter] = useState(initialLastName);
    const [languageFilter, setLanguageFilter] = useState(initialLanguage);

    // Debounce the last name filter to avoid excessive API calls
    const debouncedLastName = useDebounce(lastNameFilter, 500);

    // Effect to handle initial load and filter changes
    useEffect(() => {
        // Reset state when filters change
        setPeople([]);
        setPage(1);
        setHasMore(true);
        fetchPeople(true);

        // Update URL to reflect filters
        const params = new URLSearchParams();
        if (debouncedLastName) params.set("lastName", debouncedLastName);
        if (languageFilter) params.set("language", languageFilter);

        window.history.pushState({}, "", `?${params.toString()}`);
    }, [debouncedLastName, languageFilter]);

    // effect to load more data on page change (for infinite scroll)
    useEffect(() => {
        if (page > 1) {
            fetchPeople();
        }
    }, [page]);

    const fetchPeople = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        const newPage = reset ? 1 : page;
        const data: apiReturnType = await getPeople({
            page: newPage,
            filterLastName: debouncedLastName,
            filterLanguage: languageFilter,
        });

        if ("error" in data) {
            console.error(data.error);
            setLoading(false);
            return;
        }

        // while in this case data should always be valid, normally we should validate every incoming requested data
        const parsedData = peopleSchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Data validation error");
            setLoading(false);
            return;
        }

        const people = parsedData.data;

        if (data.length === 0) {
            setHasMore(false);
        }

        setPeople(
            (prevPeople: Array<SinglePersonType>): Array<SinglePersonType> => {
                // to handle potential duplicates from quick pagination
                const uniquePeople = new Set([
                    ...prevPeople.map((p) => p.email),
                    ...people.map((p) => p.email),
                ]);
                const combinedPeople = [...prevPeople, ...people];
                return combinedPeople.filter((p) => uniquePeople.has(p.email));
            }
        );
        setLoading(false);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">People Catalog</h1>
            <Filter
                lastName={lastNameFilter}
                language={languageFilter}
                onLastNameChange={setLastNameFilter}
                onLanguageChange={setLanguageFilter}
            />
            <PersonList
                people={people}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default App;
