"use client"

import {UserTable} from "@/app/(settings)/users/user-table";
import {useCallback, useEffect, useState} from "react";
import {AllUsersDocument, AllUsersQuery, User} from "@/lib/graph/generated/graphql"
import {getClient} from "@/lib/graph/client";
import {defaultUser} from "@/lib/graph/defaultTypes";
import {toast} from "sonner";
import {Users} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = useCallback(async () => {
    const client = getClient();

    try {
      const data = await client.request<AllUsersQuery>(AllUsersDocument)

      if (!data.users) {
        setUsers([])
        return
      }

      const users: User[] = data.users?.map(user => ({
        ...defaultUser,
        ...user
      }))
      setUsers(users);
    } catch (error) {
      toast.error("Fehler beim Laden der User")
      console.error(error)
    }
  }, [])

  useEffect(() => void fetchUsers(), [fetchUsers])

  return (
    <div className={'w-full h-full flex flex-col gap-6 px-10 grow'}>
      {/*TODO: replace this with component when available*/}
      <div className={'flex flex-col'}>
        <span className={'flex gap-2 items-center'}>
          <Users />
          <h1 className={'text-2xl font-bold'}>User Verwaltung</h1>
        </span>

        <p className={'text-xl text-muted-foreground'}>
          Verwalte hier User und deren Rollen
        </p>
      </div>
      <UserTable data={users} refreshData={fetchUsers}/>
    </div>
  )
}
