import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Toolbar,
  IconButton,
  AppBar,
  MenuItem,
  Menu,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardHeader,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import "@mui/x-data-grid-pro";
import { Info, OpenInNew, ZoomIn, ZoomOut, Sort } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import { getJsonFile } from "./utility";
import testLinks from "./testLinks.json"; // used for development and testing, but in production the one is taken from public/links.json
import "./App.css";

function App() {
  const { href } = window.location, // get the URL so we can work out where we are running
    mode = href.startsWith("http://localhost") ? "local" : "remote", // local or remote, which is then used for development and testing
    handleClickMenu = (event) => {
      setAnchorEl(event.currentTarget);
    },
    handleCloseMenu = () => {
      setAnchorEl(null);
    },
    [anchorEl, setAnchorEl] = useState(null),
    [openInfo, setOpenInfo] = useState(false),
    [width, setWidth] = useState(400),
    [urlPrefix, setUrlPrefix] = useState(null),
    [links, setLinks] = useState([]),
    sort = (v) => {
      const tempLinks = [...links];
      tempLinks.sort((a, b) => {
        if (a[v] < b[v]) return -1;
        if (a[v] > b[v]) return 1;
        return 0;
      });
      setLinks(tempLinks);
    };

  // load links from json file
  useEffect(() => {
    if (urlPrefix === null) return;
    if (mode === "local") {
      console.log("loading local data");
      setLinks(testLinks);
    } else {
      getJsonFile(urlPrefix + "/links.json", setLinks);
    }
  }, [mode, urlPrefix]);

  // handle removing the html file from the url
  useEffect(() => {
    const t1 = href.split("/");
    console.log("href", href, t1);
    if (href.includes(".html")) {
      t1.pop();
      console.log("t1", t1);
    }
    setUrlPrefix(t1.join("/"));
  }, [href]);

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar variant="dense" sx={{ backgroundColor: "#f7f7f7" }}>
          <Tooltip title="Menu">
            <IconButton
              edge="start"
              color="info"
              sx={{ mr: 2 }}
              onClick={handleClickMenu}
              aria-label="menu"
              aria-controls={Boolean(anchorEl) ? "View a table" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              border: 1,
              borderRadius: 2,
              color: "black",
              fontWeight: "bold",
              boxShadow: 3,
              fontSize: 14,
              height: 23,
              padding: 0.3,
            }}
          >
            &nbsp;Control Center&nbsp;
          </Box>
          <Box
            sx={{
              flexGrow: 0.5,
              fontSize: "0.8em",
              textAlign: "right",
              mb: 0.5,
              color:"#0288d1"
            }}
          >{`${links.length} apps`}</Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Tooltip title="Sort by url">
            <IconButton
              color="warning"
              onClick={() => {
                sort("url");
              }}
            >
              <Sort />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sort by group">
            <IconButton
              color="error"
              onClick={() => {
                sort("group");
              }}
            >
              <Sort />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom in">
            <IconButton
              color="info"
              onClick={() => {
                setWidth(width + 200);
              }}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton
              color="info"
              onClick={() => {
                setWidth(Math.max(width - 200, 200));
              }}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Information about this screen">
            <IconButton
              color="info"
              // sx={{ mr: 2 }}
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Grid container direction={"row"} spacing={2} sx={{ mt: 6, ml: 0.5 }}>
        {links.map((t, id) => (
          <Grid item key={"grid-item-" + id}>
            <Card
              sx={{ minWidth: { width }, maxWidth: { width } }}
              key={"card" + id}
              raised={true}
            >
              <CardHeader
                avatar={
                  /\p{Emoji}/u.test(t.name) ? (
                    <Box sx={{ fontSize: 22 }}>{t.name.substring(0, 2)}</Box>
                  ) : (
                    <Avatar sx={{ bgcolor: green[200], fontSize: 14 }}>
                      {t.id
                        ? t.id
                            .split("-")
                            .map((b) => b.substring(0, 1).toUpperCase())
                            .join("")
                        : "?"}
                    </Avatar>
                  )
                }
                title={/\p{Emoji}/u.test(t.name) ? t.name.substring(2) : t.name}
                action={
                  <Tooltip title="Open in new tab">
                    <IconButton
                      onClick={() => {
                        window.open(t.url, "_blank").focus();
                      }}
                    >
                      <OpenInNew />
                    </IconButton>
                  </Tooltip>
                }
              />
              {t.id ? (
                <CardMedia
                  component="img"
                  title={`Screen shot of ${t.name}`}
                  alt="Screen shot NOT FOUND"
                  src={urlPrefix + "/img/" + t.id + ".png"}
                />
              ) : (
                <p>no image</p>
              )}
              <CardContent>
                <Box sx={{ fontSize: 10 + 2 * (width / 200) }}>
                  {t.description}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    window.open(t.url, "_blank").focus();
                  }}
                >
                  Open
                </Button>
                <Box sx={{ flex: 1 }}></Box>
                <Box>
                  Group:
                  <b> {t.group}</b>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        id="link-menu"
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {links.map((t, id) => (
          <MenuItem key={"menuItem" + id} onClick={handleCloseMenu}>
            <Tooltip key={"tt" + id}>
              <Box
                color={"success"}
                size="small"
                variant="outlined"
                onClick={() => {
                  window.open(t.url, "_blank").focus();
                  // handleCloseMenu();
                }}
                // sx={{ mb: 1 }}
              >
                {t.name}
              </Box>
            </Tooltip>
          </MenuItem>
        ))}
      </Menu>
      {/* Dialog with General info about this screen */}
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => setOpenInfo(false)}
        open={openInfo}
      >
        <DialogTitle>Info about this screen</DialogTitle>
        <DialogContent>
          <ul>
            <li>
              Data comes from:{" "}
              <a
                href="https://xarprod.ondemand.sas.com/lsaf/webdav/repo/general/biostat/tools/fileviewer/index.html?file=https://xarprod.ondemand.sas.com/lsaf/webdav/repo/general/biostat/tools/control/links.json"
                target="_blank"
                rel="noreferrer"
              >
                links.json
              </a>
            </li>
          </ul>
          <Tooltip title={"Email technical programmers"}>
            <Button
              sx={{
                color: "blue",
                border: 1,
                borderColor: "blue",
                borderRadius: 1,
                padding: 0.4,
                float: "right",
              }}
              onClick={() => {
                window.open(
                  "mailto:qs_tech_prog@argenx.com?subject=Question&body=This email was sent from: " +
                    encodeURIComponent(href) +
                    "%0D%0A%0D%0AMy question is:",
                  "_blank"
                );
              }}
            >
              Email
            </Button>
          </Tooltip>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
