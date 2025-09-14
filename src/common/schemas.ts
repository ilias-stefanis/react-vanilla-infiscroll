import { z } from "zod";

const personSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(), // Added a specific email validation
    language: z.enum(["Python", "Javascript", "Golang"]),
});

type SinglePersonType = z.infer<typeof personSchema>;

const peopleSchema = z.array(personSchema);

export { personSchema, peopleSchema, type SinglePersonType };
