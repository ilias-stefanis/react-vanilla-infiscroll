import React, { useRef, useEffect, type RefObject } from "react";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import type { SinglePersonType } from "../common/schemas";
import type { usePeopleReturnType } from "../hooks/usePeopleData";

interface PersonListProps extends usePeopleReturnType {
    onLoadMore: () => void;
    listRef: RefObject<HTMLDivElement | null>;
}

function PersonList({
    people,
    isLoading,
    hasMore,
    onLoadMore,
    listRef,
    error,
}: PersonListProps) {
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [hasMore, isLoading, onLoadMore]);

    return (
        <>
            <div
                ref={listRef}
                className="grid p-6 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {people.map((person: SinglePersonType) => (
                    <Card
                        key={person.email}
                        person={person}
                    />
                ))}
            </div>
            {isLoading && <LoadingSpinner />}
            {error && (
                <p className="text-center text-red-500 my-4">
                    Error loading data. Please try again.
                </p>
            )}
            {!isLoading && !hasMore && people.length > 0 && (
                <p className="text-center text-gray-500 my-4">
                    No more people to load.
                </p>
            )}
            {!isLoading && people.length === 0 && (
                <p className="text-center text-gray-500 my-4">
                    No people found.
                </p>
            )}
            <div
                ref={loader}
                style={{ height: "20px" }}
            ></div>
        </>
    );
}

export default PersonList;
