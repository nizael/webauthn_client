import axios from "axios"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json()
    const { data } = await axios.post('http://localhost:3004/session/generate-registration-options', { username, password })
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}