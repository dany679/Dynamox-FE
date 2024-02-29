"use client";
import { cn } from "@/lib/utils";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConstructionIcon from "@mui/icons-material/Construction";
import MenuIcon from "@mui/icons-material/Menu";
import MonitorIcon from "@mui/icons-material/Monitor";
import { Button, Stack, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const pathName = usePathname();
  const { data: session } = useSession();

  const user = session?.user || null;
  // console.log(user);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar variant="dense" sx={{ flexGrow: 1, py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="truncate">
            {user?.name ? "Bem vindo " : ""}
            {user?.name || ""}
          </Typography>
          {!user ? (
            <Link href="/login">
              <Button color="inherit" variant="contained">
                Login
              </Button>
            </Link>
          ) : (
            <>
              <Button color="info" variant="contained" onClick={() => signOut()} data-test="logout-id">
                Sair
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Stack
            sx={{
              width: "100%",
              height: "75%",
              position: "relative",
            }}
          >
            <Image alt="Mountains" src={"/logoD.png"} layout="fill" objectFit="contain" />
          </Stack>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { name: "Maquinas", icon: <ConstructionIcon />, href: "/" },
            {
              name: "Pontos de acesso",
              icon: <MonitorIcon />,
              href: "/points",
            },
          ].map((link, index) => (
            <Link
              href={link.href}
              key={link.name}
              className={cn(
                "no-underline  text-gray-700",
                pathName === link.href ? "text-gray-700 hover:bg-white/10 " : "text-zinc-500"
              )}
            >
              <ListItem disablePadding>
                <ListItemButton className=" ">
                  <ListItemIcon
                    className={cn(
                      "no-underline  text-gray-700",
                      pathName === link.href ? "text-gray-700 hover:bg-white/10 " : "text-zinc-500"
                    )}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.name} className="outline-none " />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
