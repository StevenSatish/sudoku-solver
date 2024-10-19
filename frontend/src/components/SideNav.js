import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import "../App.css";
import { Drawer, ListItemButton, ListItemText } from "@mui/material";

const drawerWidth = 240; // Set the width of the Drawer

function SideNav({ children }) {
  const changePage = (page) => {
    switch (page) {
      case 1:
        if (window.location.pathname !== "/") {
          console.log(window.location.pathname);
          window.location.href = "/";
        }
        break;
      case 2:
        if (window.location.pathname !== "/solver") {
          window.location.href = "/solver";
        }
        break;
      case 3:
        if (window.location.pathname !== "/about") {
          window.location.href = "/about";
        }
        break;
      default:
        window.location.href = "/";
    }
  };
  return (
    <div className={"sidenav"} style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          style: {
            backgroundColor: "black", // Set background color to black
          },
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
      >
        <List>
          <ListItem key="Sudoku" disablePadding>
            <ListItemButton onClick={() => changePage(1)}>
              <ListItemText primary="Sudoku" sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
          <ListItem key="Sudoku Solver" disablePadding>
            <ListItemButton onClick={() => changePage(2)}>
              <ListItemText primary="Sudoku Solver" sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
          <ListItem key="About" disablePadding>
            <ListItemButton onClick={() => changePage(3)}>
              <ListItemText
                primary="About / Tips & Tricks"
                sx={{ color: "white" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  );
}

export default SideNav;
