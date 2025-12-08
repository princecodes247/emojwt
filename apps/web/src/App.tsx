import { useState } from 'react';
import { sign, verify } from '@emojwt/core';
import './App.css';

function App() {
  const [secret, setSecret] = useState('supersecret');
  const [payload, setPayload] = useState('{"sub": "123", "name": "Alice"}');
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');

  const handleSign = async () => {
    try {
      const p = JSON.parse(payload);
      const t = await sign(p, secret);
      setToken(t);
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleVerify = async () => {
    try {
      const d = await verify(token, secret);
      setDecoded(JSON.stringify(d, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setDecoded('');
    }
  };

  return (
    <div className="container">
      <h1>emojwt Playground 🥳</h1>
      
      <div className="card">
        <h2>Sign</h2>
        <div className="form-group">
          <label>Secret:</label>
          <input 
            type="text" 
            value={secret} 
            onChange={(e) => setSecret(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Payload (JSON):</label>
          <textarea 
            value={payload} 
            onChange={(e) => setPayload(e.target.value)} 
            rows={4}
          />
        </div>
        <button onClick={handleSign}>Sign Token</button>
      </div>

      <div className="card">
        <h2>Token</h2>
        <textarea 
          value={token} 
          onChange={(e) => setToken(e.target.value)} 
          rows={6}
          placeholder="Generated token will appear here..."
        />
      </div>

      <div className="card">
        <h2>Verify</h2>
        <button onClick={handleVerify}>Verify Token</button>
        {decoded && (
          <div className="result">
            <h3>Decoded Payload:</h3>
            <pre>{decoded}</pre>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
