import axios from "axios"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { userId, credentialId, publicKey, signCount } = await req.json()
    const { data } = await axios.post('http://localhost:3004/session/verify-registration', { userId, credentialId, publicKey, signCount })
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}