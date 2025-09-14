import React from "react";

const languages = ["Javascript", "Python", "Golang"];

const Filter = ({ lastName, language, onLastNameChange, onLanguageChange }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder="Filter by last name..."
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                    <option
                        key={lang}
                        value={lang}
                    >
                        {lang}
                    </option>
                ))}
            </select>

            <button
                onClick={() => {
                    onLastNameChange("");
                    onLanguageChange("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Clear Filters
            </button>
        </div>
    );
};

export default Filter;
