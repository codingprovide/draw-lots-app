"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch("/api/participant");
        if (!response.ok) {
          throw new Error("Failed to fetch participants");
        }
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const deleteParticipant = async (id) => {
    try {
      const response = await fetch(`/api/participant/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete participant");
      }
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (participant) => {
    router.push(
      `/add-user?id=${participant.id}&name=${participant.name}&role=${participant.role}`
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>所有用戶</h1>
      {participants.length === 0 ? (
        <p>No participants found.</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>
              <strong>姓名:</strong> {participant.name} <br />
              <strong>身份:</strong> {participant.role} <br />
              <button onClick={() => deleteParticipant(participant.id)}>
                刪除
              </button>
              <button onClick={() => handleEdit(participant)}>編輯</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
