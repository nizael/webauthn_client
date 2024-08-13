import axios from "axios"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { credentialId, clientDataJSON, authenticatorData, signature } = await req.json()
    const { data } = await axios.post('http://localhost:3004/session/verify-authentication', { credentialId, clientDataJSON, authenticatorData, signature })
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}