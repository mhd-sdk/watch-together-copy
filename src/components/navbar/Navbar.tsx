import * as React from "react";

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
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export const Navbar = () => {
  const root = window.document.documentElement;

  const [isDark, setIsDark] = React.useState(root.classList.contains("dark"));
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

  return (
    <div
      className={css`
        nav {
          max-width: 100%;
        }
        // target second div inside nav
        nav > div:nth-child(2) {
          // remove flexbox
          left: auto;
        }
      `}
    >
      <NavigationMenu className={css``}>
        <NavigationMenuList className={css``}>
          <NavigationMenuItem>
            <NavigationMenuTrigger>About the project</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className=" gap-3 p-4 md:w-[200px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="https://w2g.tv/fr/" title="Inspiration">
                  This project is inspired by Watch Together
                </ListItem>
                <ListItem
                  href="https://github.com/mhd-sdk/watch-together-copy.git"
                  title="Open source"
                >
                  This project is open source, you can contribute to it on
                  GitHub
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost">How to use</Button>
          </NavigationMenuItem>

          <NavigationMenuItem
            className={css`
              // this is a list element listed on horizontal, make it stick to right
            `}
          >
            <Button onClick={() => handleSwitchTheme(!isDark)} variant="ghost">
              {isDark ? <MoonIcon /> : <SunIcon />}
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
