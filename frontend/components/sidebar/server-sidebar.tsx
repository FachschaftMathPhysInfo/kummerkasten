import {ClientSidebar} from "@/components/sidebar/client-sidebar";
import {Sidebar} from "@/components/ui/sidebar";

export default function ServerSidebar() {
  return (
    <Sidebar className={'fixed h-screen top-0 left-0'} collapsible={"icon"} data-cy={'sidebar'}>
      <ClientSidebar/>
    </Sidebar>
  )
}