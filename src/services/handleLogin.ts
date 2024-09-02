import { base64urlToBase64 } from "@/utils/base64urlToBase64";
import axios from "axios";

export const handleLogin = async () => {
  try {
    const { data } = await axios.post('/api/generate-authentication');
    const challenge = Uint8Array.from(atob(base64urlToBase64(data.challenge)), c => c.charCodeAt(0));
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: data.credentials?.map((cred: any) => {
        console.log(cred.credentialId)
        return {
          id: Uint8Array.from(atob(cred.credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
        }
      }),
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    const authResponse = (assertion as PublicKeyCredential).response as AuthenticatorAssertionResponse;

    await axios.post('/api/verify-authentication', {
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
