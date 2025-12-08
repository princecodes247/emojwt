import { useState, useEffect } from 'react';
import { sign, verify, decode } from '@emojwt/browser';
import './App.css';

function App() {
  const [secret, setSecret] = useState('supersecret');
  const [payloadStr, setPayloadStr] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [token, setToken] = useState('');
  const [decodedHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [isVerified, setIsVerified] = useState(true);
  const [error, setError] = useState('');

  // Initial sign
  useEffect(() => {
    handleSign(payloadStr, secret);
  }, []);

  const handleSign = async (pStr: string, s: string) => {
    try {
      const p = JSON.parse(pStr);
      const t = await sign(p, s);
      setToken(t);
      setPayloadStr(JSON.stringify(p, null, 2));
      setIsVerified(true);
      setError('');
    } catch (e: any) {
      // Don't update token if JSON is invalid, just show error or ignore
      // But for the playground, we might want to let them type invalid JSON
    }
  };

  const handleTokenChange = async (newToken: string) => {
    setToken(newToken);
    try {
      // Try to verify first
      try {
        const d = await verify(newToken, secret);
        setPayloadStr(JSON.stringify(d, null, 2));
        setIsVerified(true);
        setError('');
      } catch (verifyError) {
        setIsVerified(false);
        // If verification fails, try to just decode
        const d = decode(newToken);
        setPayloadStr(JSON.stringify(d, null, 2));
      }
    } catch (e: any) {
      setError('Invalid token structure');
    }
  };

  const handlePayloadChange = (newPayload: string) => {
    setPayloadStr(newPayload);
    handleSign(newPayload, secret);
  };

  const handleSecretChange = (newSecret: string) => {
    setSecret(newSecret);
    // Re-verify current token with new secret
    handleTokenChange(token);
    // Or re-sign? jwt.io re-signs when you change payload, but re-verifies when you change secret if token is edited?
    // Let's keep it simple: if I change secret, I probably want to re-sign the current payload to see the new token
    handleSign(payloadStr, newSecret);
  };

  return (
    <div id="">
      <header>
        <h1><span className="logo-emoji">🥳</span> emojwt</h1>
      </header>

      {!isVerified && !error && <div className="error-banner">Invalid Signature</div>}
      {error && <div className="error-banner">{error}</div>}

      <div className="main-container">
        {/* Left Panel: Encoded */}
        <div className="editor-panel">
          <h2>Encoded</h2>
          <textarea
            className="token-input"
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right Panel: Decoded */}
        <div className="editor-panel">
          <h2>Decoded</h2>
          
          <div className="decoded-section">
            <div className="section-header">HEADER: ALGORITHM & TOKEN TYPE</div>
            <textarea
              className="json-editor color-pink"
              value={decodedHeader}
              readOnly
            />
          </div>

          <div className="decoded-section">
            <div className="section-header">PAYLOAD: DATA</div>
            <textarea
              className="json-editor color-purple"
              value={payloadStr}
              onChange={(e) => handlePayloadChange(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="decoded-section">
            <div className="section-header">VERIFY SIGNATURE</div>
            <div style={{ padding: '1rem' }}>
              <pre className="color-blue" style={{ margin: 0, fontSize: '0.9rem' }}>
                HMACSHA256(
                <br />  base64UrlEncode(header) + "." +
                <br />  base64UrlEncode(payload),
                <br />  <input 
                    type="text" 
                    className="secret-input"
                    value={secret}
                    onChange={(e) => handleSecretChange(e.target.value)}
                    placeholder="your-256-bit-secret"
                  />
                <br />)
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
