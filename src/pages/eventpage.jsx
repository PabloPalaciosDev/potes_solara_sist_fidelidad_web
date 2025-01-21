import React from "react";
import { useParams } from "react-router-dom";
import EventScreen from "../views/Event";

export default function EventPage() {
    const { idevento } = useParams(); // Obtiene el parámetro dinámico de la URL

    return <EventScreen idevento={idevento} />;
}
