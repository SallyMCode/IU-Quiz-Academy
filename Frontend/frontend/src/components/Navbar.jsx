import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-purple-600 text-white flex justify-between">
      <h1 className="text-xl font-bold">IU Quiz Academy</h1>
      <ul className="flex gap-4">
        <li><Link to="/">Start</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
        <li><Link to="/editor">Frageneditor</Link></li>
      </ul>
    </nav>
  );
}
