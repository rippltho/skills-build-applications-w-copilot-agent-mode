import React, { useEffect, useState } from 'react';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const rawCodespace = process.env.REACT_APP_CODESPACE_NAME || 'REACT_APP_CODESPACE_NAME';
  const codespace = encodeURIComponent(rawCodespace);
  const endpoint = `https://${codespace}-8000.app.github.dev/api/activities/`;

  const fetchData = async () => {
    console.log('[Activities] Fetching from', endpoint);
    setError(null);
    // Validate URL
    try {
      // This will throw if endpoint is invalid
      // eslint-disable-next-line no-new
      new URL(endpoint);
    } catch (e) {
      console.error('[Activities] Invalid URL', endpoint, e.message);
      setError(`Invalid API URL: ${e.message}`);
      return;
    }

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        const txt = await res.text();
        console.error('[Activities] Bad response', res.status, txt);
        setError(`HTTP ${res.status}: ${txt}`);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const txt = await res.text();
        console.error('[Activities] JSON parse error', jsonErr, 'text:', txt);
        setError('Invalid JSON in response');
        return;
      }

      console.log('[Activities] Raw data', data);
      const items = data && data.results ? data.results : data;
      setActivities(items || []);
    } catch (err) {
      console.error('[Activities] Fetch error', err);
      setError(String(err));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const renderTable = (items) => {
    if (!items || items.length === 0) return <div className="text-muted">No activities found.</div>;
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
          <h3 className="card-title">Activities</h3>
          <p className="card-text">Endpoint: <code>{endpoint}</code></p>
          <div className="mb-3">
            <button className="btn btn-primary me-2" onClick={fetchData}>Refresh</button>
            <a className="btn btn-link" href={endpoint} target="_blank" rel="noreferrer">Open API</a>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {renderTable(activities)}
        </div>
      </div>
    </div>
  );
}
