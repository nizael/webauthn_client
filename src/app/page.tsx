'use client'
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const base64urlToBase64 = (base64url: string) => {
    return base64url.replace(/-/g, '+').replace(/_/g, '/');
  };

  const handleRegister = async () => {
    try {
      const { data } = await axios.post('http://localhost:3004/session/generate-registration-options', { username, password });
      // Usar o challenge para iniciar a criação de credenciais WebAuthn

      const challenge = Uint8Array.from(atob(base64urlToBase64(data.challenge)), c => c.charCodeAt(0));
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "My WebAuthn App" },
        user: {
          id: Uint8Array.from(data.userId.toString() as string, c => c.charCodeAt(0)),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      if (!credential || credential.type !== 'public-key') {
        throw new Error('Invalid credential');
      }
      const attestation = (credential as PublicKeyCredential).response as AuthenticatorAttestationResponse;
     
      await axios.post('http://localhost:3004/session/verify-registration', {
        userId: data.userId,
        credentialId: (credential as PublicKeyCredential).id,
        publicKey: btoa(String.fromCharCode(...new Uint8Array(attestation.attestationObject))),
        signCount: 0,
      });

      alert('Registration successful');

    } catch (error) {
      console.error('error ===> ', error);
      alert('Registration failed');
    }
  }

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:3004/session/generate-authentication-options', { username });
     console.log( data)
      const base64urlToBase64 = (base64url: string) => {
        return base64url.replace(/-/g, '+').replace(/_/g, '/');
      };

      const challenge = Uint8Array.from(atob(base64urlToBase64(data.challenge)), c => c.charCodeAt(0));
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: data.credentials.map((cred: any) => ({
          id: Uint8Array.from(atob(cred.credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
        })),
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      const authResponse = (assertion as PublicKeyCredential).response as AuthenticatorAssertionResponse;

      await axios.post('http://localhost:3004/session/verify-authentication', {
        credentialId: (assertion as PublicKeyCredential).id,
        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(authResponse.clientDataJSON))),
        authenticatorData: btoa(String.fromCharCode(...new Uint8Array(authResponse.authenticatorData))),
        signature: btoa(String.fromCharCode(...new Uint8Array(authResponse.signature))),
      });

      alert('Login successful');
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <div className='flex flex-col gap-4'>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
