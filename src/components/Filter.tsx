const languages = ["Javascript", "Python", "Golang"];

interface FilterProps {
    lastName: string;
    language: string;
    onLastNameChange: (newLastName: string) => void;
    onLanguageChange: (newLanguage: string) => void;
}

function Filter({
    lastName,
    language,
    onLastNameChange,
    onLanguageChange,
}: FilterProps) {
    return (
        <div className="bg-white p-4 shadow-md flex flex-col md:flex-row gap-4 w-full">
            <input
                type="text"
                placeholder="Filter by last name..."
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value || "")}
                className="py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-950 text-white px-4 py-2 rounded-lg border-gray-950 w-full md:w-fit
                hover:shadow-xl
                focus:outline-2 focus:outline-offset-2 focus:outline-gray-950
                active:bg-gray-950
                py-2 rounded-lg  transition duration-300"
            >
                Clear Filters
            </button>
        </div>
    );
}

export default Filter;
