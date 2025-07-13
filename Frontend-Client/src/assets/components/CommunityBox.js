import React from 'react';
import { Link } from 'react-router-dom'; // Link importieren

function CommunityBox() {
return (
  <section className="community">
    <h2>Community & Forum</h2>
    <p>Diskutiere mit anderen Studierenden oder hole dir Tipps.</p>
    <Link to="/forum">Zum User-Forum</Link>
  </section>
);
}

export default CommunityBox;