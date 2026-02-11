import React, { useEffect, useState } from 'react';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const rawCodespace = process.env.REACT_APP_CODESPACE_NAME || 'REACT_APP_CODESPACE_NAME';
  const codespace = encodeURIComponent(rawCodespace);
  const endpoint = `https://${codespace}-8000.app.github.dev/api/teams/`;

  const fetchData = async () => {
    console.log('[Teams] Fetching from', endpoint);
    setError(null);
    try {
      new URL(endpoint);
    } catch (e) {
      console.error('[Teams] Invalid URL', endpoint, e.message);
      setError(`Invalid API URL: ${e.message}`);
      return;
    }

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        const txt = await res.text();
        console.error('[Teams] Bad response', res.status, txt);
        setError(`HTTP ${res.status}: ${txt}`);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const txt = await res.text();
        console.error('[Teams] JSON parse error', jsonErr, 'text:', txt);
        setError('Invalid JSON in response');
        return;
      }

      console.log('[Teams] Raw data', data);
      const items = data && data.results ? data.results : data;
      setTeams(items || []);
    } catch (err) {
      console.error('[Teams] Fetch error', err);
      setError(String(err));
    }
  };

  useEffect(() => { fetchData(); }, [endpoint]);

  const renderTable = (items) => {
    if (!items || items.length === 0) return <div className="text-muted">No teams.</div>;
    const cols = Object.keys(items[0] || {});
    return (
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-light">
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i}>{cols.map(c => <td key={c}>{typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Teams</h3>
          <p className="card-text">Endpoint: <code>{endpoint}</code></p>
          <div className="mb-3">
            <button className="btn btn-primary me-2" onClick={fetchData}>Refresh</button>
            <a className="btn btn-link" href={endpoint} target="_blank" rel="noreferrer">Open API</a>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {renderTable(teams)}
        </div>
      </div>
    </div>
  );
}
