import React, { useRef, useEffect } from "react";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";

const PersonList = ({ people, loading, hasMore, onLoadMore }) => {
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore) {
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
    }, [hasMore, onLoadMore]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map((person) => (
                    <Card
                        key={person.email}
                        person={person}
                    />
                ))}
            </div>
            {loading && <LoadingSpinner />}
            {!loading && !hasMore && people.length > 0 && (
                <p className="text-center text-gray-500 my-4">
                    No more people to load.
                </p>
            )}
            <div
                ref={loader}
                style={{ height: "20px" }}
            ></div>
        </div>
    );
};

export default PersonList;
