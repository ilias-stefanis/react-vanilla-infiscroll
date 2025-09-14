import Rand from "rand-seed";
import type { personSchema } from "../common/schemas";
import type z from "zod";

// To allow deterministic results based on a seed
const DEFAULT_SEED = new Rand("0000");

/**
 * Generates an array of random people objects based on the personSchema.
 * @param n Number of people to generate
 * @returns Array of people matching the schema
 */
export function generateMockPeople(
    n: number,
    seed: Rand = DEFAULT_SEED
): Array<z.infer<typeof personSchema>> {
    const firstNames = [
        "Alice",
        "Bob",
        "Charlie",
        "Diana",
        "Eve",
        "Frank",
        "Grace",
        "Hank",
        "Ivy",
        "Jack",
    ];
    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
    ];
    const emailPostfixes = ["example.com", "test.org", "mail.net"];
    const languages = ["Python", "Javascript", "Golang"];

    function pickRandomItem<T>(arr: T[]): T {
        return arr[Math.floor(seed.next() * arr.length)];
    }

    function randomEmail(first: string, last: string): string {
        return `${first.toLowerCase()}.${last.toLowerCase()}@${pickRandomItem(
            emailPostfixes
        )}`;
    }

    const people = [];
    for (let i = 0; i < n; i++) {
        const firstName = pickRandomItem(firstNames);
        const lastName = pickRandomItem(lastNames);
        people.push({
            firstName,
            lastName,
            email: randomEmail(firstName, lastName),
            language: pickRandomItem(languages) as
                | "Python"
                | "Javascript"
                | "Golang",
        });
    }
    return people;
}
