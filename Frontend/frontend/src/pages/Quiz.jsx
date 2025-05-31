import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/questions")
      .then(res => res.json())
      .then(data => {
        console.log("Fragen vom Backend:", data);
        setQuestions(data);
      })
      .catch(err => console.error("Fehler beim Laden der Fragen:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quizfragen</h2>
      {questions.length === 0 ? (
        <p>Lade Fragen...</p>
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
