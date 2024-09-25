import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240; // Set the width of the Drawer

function SideNav({ children }) {
  const changePage = (page) => {
    switch (page) {
      case 1:
        window.location.href = "/home";
        break;
      case 2:
        window.location.href = "/solver";
        break;
      case 3:
        window.location.href = "/about";
        break;
      default:
        window.location.href = "/";
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem key="Sudoku" disablePadding>
            <ListItemButton onClick={() => changePage(1)}>
              <ListItemText primary="Sudoku" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Sudoku Solver" disablePadding>
            <ListItemButton onClick={() => changePage(2)}>
              <ListItemText primary="Sudoku Solver" />
            </ListItemButton>
          </ListItem>
          <ListItem key="About" disablePadding>
            <ListItemButton onClick={() => changePage(3)}>
              <ListItemText primary="About / Tips & Tricks" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, marginLeft: `30 px` }}>{children}</main>
    </div>
  );
}

export default SideNav;
