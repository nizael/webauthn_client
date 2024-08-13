import { base64urlToBase64 } from "@/utils/base64urlToBase64";
import axios from "axios";

export const handleRegister = async (formData: FormData) => {
  const username = String(formData.get('username'))
  const password = String(formData.get('password'))

  try {
    const { data } = await axios.post('/api/generate-registration', { username, password });
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

    await axios.post('/api/verify-registration', {
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