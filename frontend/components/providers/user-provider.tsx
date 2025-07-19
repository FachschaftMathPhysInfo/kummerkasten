"use client"

import {createContext} from "react";
import {ReactNode, useContext, useEffect, useState} from "react";
import {LoginCheckDocument, LoginCheckQuery, LogoutDocument, LogoutMutation, User} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {defaultUser} from "@/lib/graph/defaultTypes";
import {deleteSID, getSID} from "@/lib/cookies";
import {useRouter} from "next/navigation"

interface UserContextType {
  user: User | null;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children } : {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [sid, setSid] = useState<string | undefined>();
  const router = useRouter();

  // fetch sid
  useEffect(() => {
    const fetchSID = async () => {
      const sid = await getSID();
      setSid(sid);
    }

    void fetchSID()
  }, []);

  // fetch user
  useEffect(() => {
    if (!sid) return

    const fetchUser = async () => {
      const client =  getClient();
      const data = await client.request<LoginCheckQuery>(LoginCheckDocument, {sid: sid})
      setUser({...defaultUser, ...data.loginCheck})
    }

    void fetchUser();
  }, [sid]);

  const logout = async () => {
    if (!sid) return
    const client = getClient();
    await client.request<LogoutMutation>(LogoutDocument, {sid: sid})
    setUser(null)
    await deleteSID()
    router.push("/")
  }

  return (
    <UserContext.Provider value={{user, logout}}>
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