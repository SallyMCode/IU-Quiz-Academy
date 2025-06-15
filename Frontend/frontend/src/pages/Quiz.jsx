import { useEffect, useState } from "react";
import api from "../services/api";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/questions")
      .then(response => {
        console.log("Fragen vom Backend:", response.data);
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden der Fragen:", err);
        setError("Fehler beim Laden der Fragen");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quizfragen</h2>
      {loading ? (
        <p>Lade Fragen...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : questions.length === 0 ? (
        <p>Keine Fragen verfügbar.</p>
      ) : (
        <ul className="list-disc pl-6">
          {questions.map((q, index) => (
            <li key={q.id || index}>
              <strong>{q.title}</strong><br />
              {q.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}