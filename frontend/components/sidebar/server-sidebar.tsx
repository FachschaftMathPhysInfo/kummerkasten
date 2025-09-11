import {ClientSidebar} from "@/components/sidebar/client-sidebar";
import {Sidebar} from "@/components/ui/sidebar";
import {getSID} from "@/lib/cookies";
import {getServerClient} from "@/lib/graph/client";
import {LoginCheckDocument} from "@/lib/graph/generated/graphql";

export default async function ServerSidebar() {
  const sid = await getSID()
  if (!sid) return null;

  const client = getServerClient()
  const data = await client.request(LoginCheckDocument, {sid: sid})

  if (!data.loginCheck) return null;

  return (
    <Sidebar className={'fixed h-screen top-0 left-0'} collapsible={"icon"} data-cy={'sidebar'}>
      <ClientSidebar/>
    </Sidebar>
  )
}