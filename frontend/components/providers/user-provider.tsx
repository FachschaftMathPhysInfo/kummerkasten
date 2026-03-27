"use client"

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {
  LoginCheckDocument,
  LoginCheckQuery,
  LoginDocument,
  LoginQuery,
  LogoutDocument,
  LogoutMutation,
  User
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {defaultUser} from "@/lib/graph/defaultTypes";
import {deleteSID, getSID} from "@/lib/cookies";
import {useRouter} from "next/navigation"

interface UserContextType {
  user: User | null;
  triggerUserRefetch: () => void;
  login: (mail: string, password: string) => Promise<boolean| null>
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const sid = await getSID();

    if (!sid) {
      setUser(null);
      return null;
    }

    const client = getClient();
    const data = await client.request<LoginCheckQuery>(LoginCheckDocument, {sid: sid})
    if (!data.loginCheck) setUser(null)
    else setUser(prevState => ({
      ...defaultUser,
      ...prevState,
      ...data.loginCheck
    }))
  }, [])

  useEffect(() => {
    (async () => await fetchUser())();
  }, [fetchUser])

  const triggerUserRefetch = () => {
    (async () => await fetchUser())();
  }

  const login = async (mail: string, password: string): Promise<boolean | null> => {
    const client = getClient();
    try {
      const response = await client.request<LoginQuery>(
        LoginDocument,
        {mail: mail, password: password}
      )

      if (response.login) {
        await fetchUser();
        return true
      } else {
        return false
      }
    } catch (err) {
      if(String(err).includes("credentials")) return false
    }

    return null
  }

  const logout = async () => {
    const sid = await getSID();

    if (!sid) return
    const client = getClient();
    await client.request<LogoutMutation>(LogoutDocument, {sid: sid})
    setUser(null)
    await deleteSID()
    router.push("/login")
  }

  return (
    <UserContext.Provider value={{user, triggerUserRefetch, login, logout}}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}