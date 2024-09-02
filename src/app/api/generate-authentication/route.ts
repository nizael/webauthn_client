import axios from "axios"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const {data} = await axios.post('http://localhost:3004/session/generate-authentication-options')
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}