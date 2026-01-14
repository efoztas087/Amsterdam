"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../Mensen.css";

export default function PersonDetailPage() {
  const { id } = useParams() as { id: string };
  const [person, setPerson] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then(res => res.json())
      .then(data => setPerson(data.person))
      .catch(() => setPerson(null));
  }, [id]);

  if (!person) return <p>Loading...</p>;

  return (
    <>
      <main className="page-container person-detail-page">
        <div className="person-detail">
          <img src={person.image} alt={person.name} className="person-detail__img" />
          <h1 className="person-detail__name">{person.name}</h1>
          <p className="person-detail__role">{person.role}</p>
          <p className="person-detail__bio">{person.bio}</p>
        </div>
      </main>
    </>
  );
}