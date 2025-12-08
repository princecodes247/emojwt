import { useState, useEffect } from 'react';
import { sign, verify, decode, EMOJI_MAP } from '@emojwt/browser';
import './App.css';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [secret, setSecret] = useState('supersecret');
  const [payloadStr, setPayloadStr] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [token, setToken] = useState('');
  const [decodedHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [isVerified, setIsVerified] = useState(true);
  const [error, setError] = useState('');
  const [logoEmoji, setLogoEmoji] = useState(EMOJI_MAP[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % EMOJI_MAP.length;
      setLogoEmoji(EMOJI_MAP[index]);
    }, 500); // Change every 500ms
    return () => clearInterval(interval);
  }, []);

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
    }
  };

  const handleTokenChange = async (newToken: string) => {
    setToken(newToken);
    try {
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
    handleTokenChange(token);
    // Or re-sign? jwt.io re-signs when you change payload, but re-verifies when you change secret if token is edited?
    // Let's keep it simple: if I change secret, I probably want to re-sign the current payload to see the new token
    handleSign(payloadStr, secret);
  };

  return (
    <div id="root">
      <header>
        <h1><span className="logo-emoji">{logoEmoji}</span> emojwt</h1>
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
                <input 
                    type="text" 
                    className="secret-input"
                    value={secret}
                    onChange={(e) => handleSecretChange(e.target.value)}
                    placeholder="your-256-bit-secret"
                  />
                <br />
              </pre>
            </div>
          </div>
        </div>
      </div>
    <Analytics />
    </div>
  );
}

export default App;
