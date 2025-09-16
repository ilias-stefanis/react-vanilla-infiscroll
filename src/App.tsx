import { useState, useEffect, useRef } from "react";
import PersonList from "./components/PersonList";
import Filter from "./components/Filter";

import "./index.css";
import "./App.css";
import { type paginationStateType } from "./common/types";
import { usePeopleData } from "./hooks/usePeopleData";

// Read initial filter state from URL on page load
const urlParams = new URLSearchParams(window.location.search);
const initialLastName = urlParams.get("lastName") || "";
const initialLanguage = urlParams.get("language") || "";

const App = () => {
    // Filter state
    const [lastNameFilter, setLastNameFilter] = useState(initialLastName);
    const [languageFilter, setLanguageFilter] = useState(initialLanguage);

    const listRef = useRef<null | HTMLDivElement>(null);

    const [paginationState, setPaginationState] = useState<paginationStateType>(
        {
            page: 1,
            filterLastName: lastNameFilter,
            filterLanguage: languageFilter,
        }
    );

    const { people, isLoading, hasMore, error } =
        usePeopleData(paginationState);

    // Effect to handle initial load and filter changes
    useEffect(() => {
        // Update URL to reflect filters
        const params = new URLSearchParams();
        if (lastNameFilter) params.set("lastName", lastNameFilter);
        if (languageFilter) params.set("language", languageFilter);

        window.history.pushState({}, "", `?${params.toString()}`);
    }, [lastNameFilter, languageFilter]);


    // To make reseting smooth
    function scrollToTop() {
        listRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    // To avoid sending a request on every keystroke, we debounce the last name filter input
    const [debounceTimer, setDebounceTimer] = useState<null | number>(null);

    function handleLastNameFilterChange(newLastName: string) {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        setLastNameFilter(newLastName);

        setDebounceTimer(
            setTimeout(function () {
                // Update pagination state
                setPaginationState((prevState) => ({
                    ...prevState,
                    filterLastName: newLastName,
                    page: 1, // reset to first page on filter change
                }));

                scrollToTop();
            }, 500)
        );
    }

    function handleLanguageFilterChange(newLanguage: string) {
        setLanguageFilter(newLanguage);

        // Update pagination state
        setPaginationState((prevState) => ({
            ...prevState,
            filterLanguage: newLanguage,
            page: 1, // reset to first page on filter change
        }));
        scrollToTop();
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
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-64 bg-gray-950 shadow-md hidden xl:flex flex-col p-6">
                <div className="text-2xl text-white font-bold mb-8 text-gray-700">
                    Dashboard
                </div>
                <nav className="flex flex-col gap-4">
                    <span className="text-gray-50 font-bold">People</span>
                    <span className="text-gray-200">Settings</span>
                    <span className="text-gray-200">Reports</span>
                    <span className="text-gray-200">Help</span>
                </nav>
            </div>

            <div className="flex-1 flex flex-col max-h-screen ">
                <header className="bg-white shadow px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold text-gray-700">
                        People Catalog
                    </h1>
                </header>
                <div className="w-full md:w-auto">
                    <Filter
                        lastName={lastNameFilter}
                        language={languageFilter}
                        onLastNameChange={handleLastNameFilterChange}
                        onLanguageChange={handleLanguageFilterChange}
                    />
                </div>

                <div className="flex-1  overflow-y-auto">
                    <PersonList
                        people={people}
                        isLoading={isLoading}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                        error={error}
                        listRef={listRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
