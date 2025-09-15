import { peopleSchema, type SinglePersonType } from "../common/schemas";
import { generateMockPeople } from "./peopleMockGenerator";
import Rand from "rand-seed";

const SEED = new Rand("1234");
const PAGE_SIZE = 20;
const TOTAL_PEOPLE = 200;

// Pre-generate a list of people based on first load, using a deterministic seed
const peopleList = generateMockPeople(TOTAL_PEOPLE, SEED);

type apiParams = {
    page?: number;
    filterLastName: string | null;
    filterLanguage: string | null;
};
export type apiReturnType = Array<SinglePersonType> | { error: string };

async function getPeople({
    page = 1,
    filterLastName,
    filterLanguage,
}: apiParams): Promise<apiReturnType> {
    return new Promise((resolve) => {
        setTimeout(() => {

            console.log(
                `API called with page=${page}, filterLastName=${filterLastName}, filterLanguage=${filterLanguage}`);

            let filteredPeople = peopleList;

            if (filterLastName && filterLastName.trim() !== "") {
                filteredPeople = filteredPeople.filter((person) =>
                    person.lastName
                        .toLowerCase()
                        .includes(filterLastName.toLowerCase())
                );
            }

            if (filterLanguage && filterLanguage.trim() !== "") {
                filteredPeople = filteredPeople.filter(
                    (person) => person.language === filterLanguage
                );
            }

            const startIdx = (page - 1) * PAGE_SIZE;
            const paginatedPeople = filteredPeople.slice(
                startIdx,
                startIdx + PAGE_SIZE
            );

            const parsed = peopleSchema.safeParse(paginatedPeople);
            if (!parsed.success) {
                resolve({ error: "Data validation error" });
            } else {
                resolve(parsed.data);
            }
        }, 50 + Math.random() * 1000); // Simulate network latency
    });
}

export { getPeople };
