'use client'
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Converte uma string Base64URL para ArrayBuffer
  const base64URLToArrayBuffer = (base64URL: string): ArrayBuffer => {
    const padding = '='.repeat((4 - (base64URL.length % 4)) % 4);
    const base64 = (base64URL + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0))).buffer;
  };

  // Converte um ArrayBuffer para uma string Base64URL
  const arrayBufferToBase64URL = (buffer: ArrayBuffer): string => {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const register = async () => {
    // Solicita as opções de registro ao backend
    const response = await fetch('http://localhost:3004/session/generate-registration-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const options = await response.json();

    // Converte desafios de Base64URL para ArrayBuffer
    options.challenge = base64URLToArrayBuffer(options.challenge);
    options.user.id = base64URLToArrayBuffer(options.user.id);

    // Usa a API WebAuthn para criar credenciais
    const credential = await navigator.credentials.create({
      publicKey: options,
    }) as PublicKeyCredential;

    // Envia as credenciais ao backend para verificação
    const attestationResponse = {
      id: credential.id,
      rawId: arrayBufferToBase64URL(credential.rawId),
      response: {
        clientDataJSON: arrayBufferToBase64URL(credential.response.clientDataJSON),
        attestationObject: arrayBufferToBase64URL((credential.response as AuthenticatorAttestationResponse).attestationObject!),
      },
      type: credential.type,
    };

    const verifyResponse = await fetch('http://localhost:3004/session/verify-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, attestation: attestationResponse }),
    });

    const { verified } = await verifyResponse.json();
    setMessage(verified ? 'Registro bem-sucedido!' : 'Falha no registro.');
  };

  const authenticate = async () => {
    // Solicita as opções de autenticação ao backend
    const response = await fetch('http://localhost:3004/session/generate-authentication-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const options = await response.json();

    // Converte o desafio de Base64URL para ArrayBuffer
    options.challenge = base64URLToArrayBuffer(options.challenge);
    options.allowCredentials = options.allowCredentials.map((cred: any) => ({
      ...cred,
      id: base64URLToArrayBuffer(cred.id),
    }));

    // Usa a API WebAuthn para assinar o desafio
    const assertion = await navigator.credentials.get({
      publicKey: options,
    }) as PublicKeyCredential;

    // Envia a assinatura ao backend para verificação
    const assertionResponse = {
      id: assertion.id,
      rawId: arrayBufferToBase64URL(assertion.rawId),
      response: {
        clientDataJSON: arrayBufferToBase64URL(assertion.response.clientDataJSON),
        authenticatorData: arrayBufferToBase64URL((assertion.response as AuthenticatorAssertionResponse).authenticatorData!),
        signature: arrayBufferToBase64URL((assertion.response as AuthenticatorAssertionResponse).signature!),
      },
      type: assertion.type,
    };

    const verifyResponse = await fetch('http://localhost:3004/session/verify-authentication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, assertion: assertionResponse }),
    });

    const { verified } = await verifyResponse.json();
    setMessage(verified ? 'Autenticação bem-sucedida!' : 'Falha na autenticação.');
  };

  return (
    <div className="flex flex-col gap-4 w-52 bg-slate-100">
      <h1>WebAuthn Demo</h1>
      <input 
        type="text" 
        placeholder="Nome de Usuário" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <button onClick={register}>Registrar</button>
      <button onClick={authenticate}>Autenticar</button>
      <p>{message}</p>
    </div>
  );
}
