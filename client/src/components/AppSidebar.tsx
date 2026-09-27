import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Briefcase,
  DollarSign,
  HomeIcon,
  LogOut,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";
import Loading from "./Loading";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const navLinks = {
    student: [
      { icon: HomeIcon, label: "Home", href: "/" },
      { icon: BookOpen, label: "Courses", href: "/user/courses" },
      { icon: BookOpen, label: "New Courses", href: "/user/newcourseregistration" },
      { icon: User, label: "Profile", href: "/user/profile" },
      { icon: Settings, label: "Settings", href: "/user/settings" },
    ],
    teacher: [
      { icon: BookOpen, label: "Courses", href: "/teacher/courses" },
      { icon: User, label: "Profile", href: "/teacher/profile" },
      { icon: Settings, label: "Settings", href: "/teacher/settings" },
    ],
  };

  if (!isLoaded) return <Loading />;
  if (!user) return <div>User not found</div>;

  const userType =
    (user.publicMetadata.userType as "student" | "teacher") || "student";
  const currentNavLinks = navLinks[userType];

  return (
    <Sidebar
      collapsible="icon"
      style={{ height: "100vh" }}
      className="bg-white-100 dark:bg-white-100 border-none border-r border-gray-200 shadow-none"
    >
      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
  size="lg"
  onClick={() => toggleSidebar()}
  className="group hover:bg-udemy-lightGray transition-colors duration-200"
>
  <div className="app-sidebar__logo-container group">
    <div className="app-sidebar__logo-wrapper">
      <p className="app-sidebar__title text-udemy-black">LMS Platform</p>
    </div>
    <PanelLeft className="app-sidebar__collapse-icon text-udemy-gray group-hover:text-udemy-black" />
  </div>
</SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {currentNavLinks.map((link) => {
            //const isActive = pathname.startsWith(link.href);
            const isActive =
               link.href === '/'
               ? pathname === '/'
               : pathname.startsWith(link.href);

            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "app-sidebar__nav-item",
                  isActive && "bg-udemy-purpleLight"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "app-sidebar__nav-button",
                    !isActive && "text-udemy-gray"
                  )}
                >
                  <Link
                    href={link.href}
                    className="app-sidebar__nav-link"
                    scroll={false}
                  >
                    <link.icon
                      className={isActive ? "text-udemy-purple" : "text-udemy-gray"}
                    />
                    <span
                      className={cn(
                        "app-sidebar__nav-text",
                        isActive ? "text-udemy-purple font-bold" : "text-udemy-gray"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-sidebar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => signOut()}
                className="app-sidebar__signout"
              >
                <LogOut className="mr-2 h-6 w-6" />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
