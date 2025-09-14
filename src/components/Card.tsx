import React, { useState } from "react";
import InviteModal from "./InviteModal";

import { type SinglePersonType } from "../common/schemas";

const Card = ({ person }: { person: SinglePersonType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
                className="mt-4 w-full bg-blue-600 light:bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
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
};

export default Card;
