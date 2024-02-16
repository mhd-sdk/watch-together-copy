import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { css } from "@emotion/css";
import { Button } from "../ui/button";
import { CopyIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const RoomNavbar = () => {
  const root = window.document.documentElement;
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  const [isDark, setIsDark] = useState(root.classList.contains("dark"));
  const handleSwitchTheme = (isDark: boolean) => {
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("watchtogetherynov-isdarkmode", "true");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("watchtogetherynov-isdarkmode", "false");
    }
    setIsDark(isDark);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div
      className={css`
        display: flex;
        gap: 4px;
      `}
    >
      <Button onClick={() => handleNavigate("/")} variant="ghost">
        Quit room
      </Button>

      <Input
        className={css`
          width: 300px;
        `}
        value={window.location.href}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleCopy} variant="ghost">
            <CopyIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy link to clipboard</p>
        </TooltipContent>
      </Tooltip>

      <Button
        className={css`
          margin-left: auto;
        `}
        onClick={() => handleSwitchTheme(!isDark)}
        variant="ghost"
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </Button>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
