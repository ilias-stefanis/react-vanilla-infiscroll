import React, { useState, useEffect } from "react";
import PersonList from "./components/PersonList";
import Filter from "./components/Filter";
import useDebounce from "./hooks/useDebounce";
import "./index.css";
import "./App.css";
import { type paginationStateType } from "./common/types";
import { usePeopleData } from "./hooks/usePeopleData";

const App = () => {
    // Read initial filter state from URL on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const initialLastName = urlParams.get("lastName") || "";
    const initialLanguage = urlParams.get("language") || "";


    // Filter state
    const [lastNameFilter, setLastNameFilter] = useState(initialLastName);
    const [languageFilter, setLanguageFilter] = useState(initialLanguage);

        // Debounce the last name filter to avoid excessive API calls
    const debouncedLastName = useDebounce(lastNameFilter, 1500);

    const [paginationState, setPaginationState] = useState<paginationStateType>(
        {
            page: 1,
            filterLastName: debouncedLastName,
            filterLanguage: languageFilter,
        }
    );

    const { people, isLoading, hasMore, error } =
        usePeopleData(paginationState);




    // Effect to handle initial load and filter changes
    useEffect(() => {
        // Update URL to reflect filters
        const params = new URLSearchParams();
        if (debouncedLastName) params.set("lastName", debouncedLastName);
        if (languageFilter) params.set("language", languageFilter);

        window.history.pushState({}, "", `?${params.toString()}`);
    }, [debouncedLastName, languageFilter]);



    function handleLastNameFilterChange(newLastName: string) {
        setLastNameFilter(newLastName);

        // Update pagination state

        setPaginationState((prevState) => ({
            ...prevState,
            filterLastName: newLastName,
            page: 1, // reset to first page on filter change
        }));
    }

    function handleLanguageFilterChange(newLanguage: string) {
        setLanguageFilter(newLanguage);

        // Update pagination state
        setPaginationState((prevState) => ({
            ...prevState,
            filterLanguage: newLanguage,
            page: 1, // reset to first page on filter change
        }));
    }

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPaginationState((prevState) => ({
                ...prevState,
                page: prevState.page + 1,
            }));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">People Catalog</h1>
            <Filter
                lastName={lastNameFilter}
                language={languageFilter}
                onLastNameChange={handleLastNameFilterChange}
                onLanguageChange={handleLanguageFilterChange}
            />
            <PersonList
                people={people}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                errorStatus={error}
            />
        </div>
    );
};

export default App;
