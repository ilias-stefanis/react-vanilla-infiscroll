import { useState } from "react";
import InviteModal from "./InviteModal";

import { type SinglePersonType } from "../common/schemas";

interface CardProps {
    person: SinglePersonType;
}

function Card({ person }: CardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg justify-between shadow-md p-4 md:p-6 border border-gray-200 flex flex-col">
            <h3 className="text-xl font-semibold">
                {person.firstName} {person.lastName}
            </h3>
            <p className="text-gray-600 truncate">{person.email}</p>
            <p className="text-sm font-medium text-gray-500 mt-2">
                Preferred Language:{" "}
                <span className="text-blue-600">{person.language}</span>
            </p>
            <button
                onClick={() => setIsModalOpen(true)}
                className="
                bg-gray-950 text-white border-gray-950 max-w-3xs
                hover:shadow-xl
                focus:outline-2 focus:outline-offset-2 focus:outline-gray-950
                active:bg-gray-950
                mt-4 w-full py-2 rounded-lg  transition duration-300"
            >
                Invite
            </button>

            <InviteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                personName={`${person.firstName} ${person.lastName}`}
            />
        </div>
    );
}

export default Card;
