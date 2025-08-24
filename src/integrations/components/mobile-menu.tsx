/** @jsxImportSource react */

import { LucideMenu } from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { certMenu, homeMenu, verifyMenu } from "../data/menu-items"

export function MobileMenu() {
    const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="rounded-full focus:bg-primary focus:text-primary-foreground">
          <LucideMenu/>
        </SheetTrigger>
        <SheetContent size='lg'>
          <SheetHeader>
            <SheetTitle>DSigner</SheetTitle>
          </SheetHeader>
          <Sidebar home={homeMenu} cert={certMenu} verify={verifyMenu} className="-mx-4" />
        </SheetContent>
      </Sheet>
  )
}
