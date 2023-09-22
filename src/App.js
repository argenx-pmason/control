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
import // DataGridPro,
// LicenseInfo,
// GridToolbar,
// GridRowModes,
// GridToolbarContainer,
// GridActionsCellItem,
// GridRowEditStopReasons,
// GridToolbarExport,
"@mui/x-data-grid-pro";
import { Info, OpenInNew, ZoomIn, ZoomOut } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import { getJsonFile } from "./utility";
import testLinks from "./testLinks.json"; // used for development and testing, but in production the one is taken from public/links.json
import "./App.css";

// apply the license for data grid
// LicenseInfo.setLicenseKey(
//   "369a1eb75b405178b0ae6c2b51263cacTz03MTMzMCxFPTE3MjE3NDE5NDcwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
// );

function App() {
  const { href } = window.location, // get the URL so we can work out where we are running
    mode = href.startsWith("http://localhost") ? "local" : "remote", // local or remote, which is then used for development and testing
    // webDavPrefix = "https://xarprod.ondemand.sas.com/lsaf/webdav/repo", // prefix for webdav access to LSAF
    // fileViewerPrefix =
    //   "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd:/general/biostat/tools/fileviewer/index.html?file=",
    // logViewerPrefix =
    //   "https://xarprod.ondemand.sas.com/lsaf/webdav/repo/general/biostat/tools/logviewer/index.html",
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
    [links, setLinks] = useState([]);

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
        <Toolbar variant="dense">
          <Tooltip title="Menu">
            <IconButton
              edge="start"
              color="inherit"
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
          <Box color="inherit">Control Center</Box>
          <Box
            sx={{
              flexGrow: 0.5,
              fontSize: "0.8em",
              textAlign: "right",
              mb: 0.5,
            }}
          >{`${links.length} apps`}</Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Tooltip title="Zoom in">
            <IconButton
              color="inherit"
              onClick={() => {
                setWidth(width + 200);
              }}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton
              color="inherit"
              onClick={() => {
                setWidth(Math.max(width - 200, 200));
              }}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Information about this screen">
            <IconButton
              color="inherit"
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
            <li>Data comes from ...</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
