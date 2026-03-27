"use client"

import {TableUser, UserTable} from "@/app/(settings)/users/user-table";
import {useCallback, useEffect, useState} from "react";
import {AllUsersDocument, AllUsersQuery} from "@/lib/graph/generated/graphql"
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {Users} from "lucide-react";
import {ManagementPageHeader} from "@/components/management-page-header";
import {useTranslations} from "use-intl";

export default function UserManagementPage() {
  const t = useTranslations("Settings.UserManagementPage")
  const [users, setUsers] = useState<TableUser[]>([])

  const fetchUsers = useCallback(async () => {
    const client = getClient();

    try {
      const data = await client.request<AllUsersQuery>(AllUsersDocument)

      if (!data.users) {
        setUsers([])
        return
      }

      setUsers(data.users.filter(user => !!user));
    } catch (error) {
      toast.error(t("toast.fetchError"))
      console.error(error)
    }
  }, [t])

  useEffect(() => {
    (async () => {
      await fetchUsers()
    })()
  }, [fetchUsers])

  return (
    <div className="w-full h-full flex flex-col grow">
      <ManagementPageHeader
        icon={<Users/>}
        title={t("header")}
        description={t("description")}
      />
      <div className={'w-full h-full flex flex-col gap-6 px-10 pt-4 grow'}>
        <UserTable data={users} refreshData={fetchUsers}/>
      </div>
    </div>
  )
}
