"use server"

import {cookies} from "next/headers";


export async function getSID() {
  const jar = await cookies()
  return jar.get("sid")?.value
}

export async function deleteSID() {
  const jar = await cookies()
  jar.delete("sid")
}