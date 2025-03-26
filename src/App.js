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
  Link,
  Button,
  Chip,
  Grid,
  Switch,
  Avatar,
} from "@mui/material";
import "@mui/x-data-grid-pro";
import { Masonry } from "@mui/lab";
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
    [width, setWidth] = useState(200),
    [urlPrefix, setUrlPrefix] = useState(null),
    [links, setLinks] = useState([]),
    [sortedLinks, setSortedLinks] = useState([]),
    [columns, setColumns] = useState(6),
    [showAll, setShowAll] = useState(false),
    sort = (v) => {
      const tempLinks = [...links];
      tempLinks.sort((a, b) => {
        if (a[v] < b[v]) return -1;
        if (a[v] > b[v]) return 1;
        return 0;
      });
      setLinks(tempLinks);
    },
    defaultColumns = localStorage.getItem("columns");

  // do once
  useEffect(() => {
    if (defaultColumns) setColumns(parseInt(defaultColumns));
  }, [defaultColumns]);

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

  useEffect(() => {
    let clonedArray = JSON.parse(JSON.stringify(links));
    // sort clonedArray by name
    clonedArray.sort((a, b) => {
      const aa = a.name.replace(/\p{Emoji}/gu, " "),
        bb = b.name.replace(/\p{Emoji}/gu, " ");
      if (aa < bb) return -1;
      if (aa > bb) return 1;
      return 0;
    });
    console.log("sorted", clonedArray);
    setSortedLinks(clonedArray);
  }, [links]);

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
              // flexGrow: 0.5,
              fontSize: "0.8em",
              textAlign: "right",
              mb: 0.5,
              ml: 2,
              color: "#0288d1",
            }}
          >{`${links.filter((t) => showAll || t.show).length} apps`}</Box>
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
          <Tooltip title="Switch between showing everything and just the general apps">
            <Switch
              color="primary"
              checked={showAll}
              onChange={() => {
                setShowAll(!showAll);
              }}
            >
              <Sort />
            </Switch>
          </Tooltip>
          <Tooltip title="Zoom in">
            <IconButton
              color="info"
              onClick={() => {
                setWidth(width + 100);
                setColumns(columns + 1);
                localStorage.setItem("columns", columns + 1);
              }}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton
              color="info"
              onClick={() => {
                setWidth(Math.max(width - 100, 100));
                setColumns(Math.max(columns - 1, 1));
                localStorage.setItem("columns", Math.max(columns - 1, 1));
              }}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Box sx={{ color: "black" }}>Click for PROD, CTRL-click for VAL</Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Tooltip title="Bookmarklet for viewing LSAF files (drag to favorites bar)">
            <Link
              sx={{ ml: 2 }}
              underline="hover"
              href="
    javascript:(/*-- Open a viewer web app using selected item --*/ function(document) {const iframe=document.getElementById('sasLSAF_iframe'),
    iWindow = iframe.contentWindow,
    iDocument = iWindow.document,
    repo=iDocument.querySelector('[aria-label=%22Selected, Workspace%22]') ? 'work' : 'repo',
    full=repo==='work'?'WORKSPACE':'REPOSITORY',
    qs=iDocument.getElementById('HLS_LSAF_'+full+'--navLinkInput-inner'),
    v = qs ? qs.value : null,
    lastPart = v.split(%27/%27).pop(),
    type=lastPart.split(%27.%27).pop(),
    { href, protocol, host } = window.location,
    urlPrefix = protocol + %27//%27 + host,
    filelink=urlPrefix+%27/lsaf/webdav/%27+repo+v;
    if (lastPart==='documents') open(urlPrefix+%27/lsaf/webdav/repo/general/biostat/apps/dashstudy/index.html?file=%27+v+'/meta/dashstudy.json');
    else if (lastPart.split(%27.%27).length===1) open(urlPrefix+%27/lsaf/webdav/repo/general/biostat/apps/fileviewer/index.html?file=%27+v);
    else if (type===%27log%27) open(urlPrefix+%27/lsaf/webdav/repo/general/biostat/apps/logviewer/index.html?log=%27+filelink);
    else if (type==='json') open(urlPrefix+'/lsaf/webdav/repo/general/biostat/apps/view/index.html?lsaf='+v);
    else open(urlPrefix+%27/lsaf/webdav/repo/general/biostat/apps/fileviewer/index.html?file=%27+filelink);})(document);
    "
            >
              🔍
            </Link>
          </Tooltip>
          <Tooltip title="Switch between location in Workspace and Repository (drag to favorites bar)">
            <Link
              sx={{ ml: 2 }}
              underline="hover"
              href="javascript:(/*-- Switch between LSAF Repository and Workspace locations --*/ function(){const iframe=document.getElementById(%22sasLSAF_iframe%22),iWindow=iframe.contentWindow,iDocument=iWindow.document,repo=iDocument.querySelector(%27[aria-label=%22Selected, Workspace%22]%27)?%22work%22:%22repo%22,full=%22work%22===repo?%22WORKSPACE%22:%22REPOSITORY%22,qs=iDocument.getElementById(%22HLS_LSAF_%22+full+%22--navLinkInput-inner%22),full2=%22work%22===repo?%22REPOSITORY%22:%22WORKSPACE%22,qs2=iDocument.getElementById(%22HLS_LSAF_%22+full2+%22--navLinkInput-inner%22),wrk=iDocument.getElementById(%22sasLSAF--sasLSAF_appContainer_lfn_4_icn%22),wrk2=%22true%22===iDocument.getElementById(%22sasLSAF--sasLSAF_appContainer_lfn_4%22).getAttribute(%22aria-selected%22),rp=iDocument.getElementById(%22sasLSAF--sasLSAF_appContainer_lfn_3_icn%22),rp2=%22true%22===iDocument.getElementById(%22sasLSAF--sasLSAF_appContainer_lfn_3%22).getAttribute(%22aria-selected%22),current=qs.value;wrk2&&rp.click(),rp2&&wrk.click(),qs2.value=current,qs2.dispatchEvent(keyboardEvent=new KeyboardEvent(%22keydown%22,{code:%22Enter%22,key:%22Enter%22,charCode:13,keyCode:13,view:window,bubbles:!0})),setTimeout((()=>{const e=iDocument.querySelectorAll(%27[aria-selected=%22true%22]%27);console.log(%22sel%22,e),e[2].scrollIntoViewIfNeeded()}),2e3);}());"
              ICON="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+klEQVQ4jX2SPU8VURCGnzl7ztmzC0ZiwCB+xKCABTHU/ggrxcTSgsLSQqPewkJNtCKxM8TCmoIfYCyoKCyMhQGMsTPE3MLg9e7H3d2xAK8X8DLJVPPOk3lnRlRVGBJzz1hUeDusLrBphxUBImG9UiqBdIjkojkO8PkROwaWgHLoFIMWZl7h+cllgPJ3h7IsKTsd3Gg87Vx63RgTwkg6jci1/ZbdAxbcL05Vhk+oGht76qbGxJ7ubpcia9Mriub83NxqSEf6PQcs7I/8TkSInCNOkoFMcXEwWjf5YM+RHSjcAd3oQ9J0PxPiNKEsi1WgD5HZp3qrqWtf5jl5llPmOb0iN877BYmYGps43RbM3SLLKLOMuinmx89cmAVWAGsVWmLMvPUOV9doU6NNRdHtUuQZ1LI2fu4scZIgQNVzbD1m7dIL3puSBWuUZRVZiawjDgNGFBSlof4uIkTWEicJJi4A+PqAXWDdbLZ4g3JPRNqRc/gQ8CHBJ4E4JPSK4iOwLiIYa/Fu9MDODMBWi+UTE0xVRibF+qt7kL10cdo0hhsqrIpIdXjp/T/4sEQF/Jh+DlZc34kxhi8PaQOLV14yenKM/L+Av/FthvbstuxY5yZRRey/S2/ep3NYf/QPbtKo8kREsN4TQjgsOR4AsN3itcJtEdmQyHWPA/wBGZyw943uVMMAAAAASUVORK5CYII="
            >
              🔁
            </Link>
          </Tooltip>
          <Tooltip title="Prompt the user and search SharePoint for something (drag to favorites bar)">
            <Link
              sx={{ ml: 2 }}
              underline="hover"
              href="javascript:void(/*-- Prompt user and search SharePoint --*/ window.open('https://argenxbvba.sharepoint.com/sites/Biostatistics/_layouts/15/search.aspx/siteall?q='+prompt ('Search SharePoint:')));"
            >
              SP🤓
            </Link>
          </Tooltip>
          <Tooltip title="Information about this screen">
            <IconButton
              color="info"
              sx={{ ml: 2 }}
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 6, ml: 0.5 }}>
        <Grid item key={"grid-chips"}>
          {sortedLinks.map((t, id) => {
            if (showAll || t.show)
              return (
                <Tooltip key={"tt" + id} title={t.description}>
                  <Chip
                    key={"chip" + id}
                    label={t.name}
                    size="small"
                    onClick={(e) => {
                      let url = t.url;
                      if (e.ctrlKey) url = t.url.replace("xarprod", "xarval");
                      window.open(url, "_blank").focus();
                    }}
                    style={{ margin: 2 }}
                  />
                </Tooltip>
              );
            else return null;
          })}
        </Grid>
        {/* <Grid container direction={"row"} spacing={2} sx={{ mt: 6, ml: 0.5 }}> */}
        <Masonry spacing={2} columns={columns}>
          {links.map((t, id) => {
            if (showAll || t.show)
              return (
                <Grid item key={"grid-item-" + id}>
                  <Card
                    // sx={{ minWidth: { width }, maxWidth: { width } }}
                    key={"card" + id}
                    raised={true}
                  >
                    <CardHeader
                      avatar={
                        /\p{Emoji}/u.test(t.name) ? (
                          <Box sx={{ fontSize: 22 }}>
                            {t.name.substring(0, 2)}
                          </Box>
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
                      title={
                        /\p{Emoji}/u.test(t.name) ? t.name.substring(2) : t.name
                      }
                      action={
                        <Tooltip title="Open in new tab">
                          <IconButton
                            onClick={(e) => {
                              let url = t.url;
                              if (e.ctrlKey)
                                url = t.url.replace("xarprod", "xarval");
                              window.open(url, "_blank").focus();
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
                      <Box sx={{ fontSize: 10 + 2 * (width / 100) }}>
                        {t.description}
                      </Box>
                    </CardContent>
                    <CardActions>
                      {t.url.includes("sharepoint.com") ? (
                        <Button
                          onClick={(e) => {
                            window.open(t.url, "_blank").focus();
                          }}
                        >
                          SharePoint
                        </Button>
                      ) : (
                        <Box>
                          <Button
                            onClick={(e) => {
                              window.open(t.url, "_blank").focus();
                            }}
                          >
                            Prod
                          </Button>
                          <Button
                            onClick={(e) => {
                              let url = t.url.replace("xarprod", "xarval");
                              window.open(url, "_blank").focus();
                            }}
                          >
                            Val
                          </Button>
                        </Box>
                      )}
                      <Box sx={{ flex: 1 }}></Box>
                      <Box>
                        Group:
                        <b> {t.group}</b>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            else return null;
          })}
        </Masonry>
        {/* </Grid> */}
      </Box>
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
        {sortedLinks.map((t, id) => (
          <MenuItem key={"menuItem" + id} onClick={handleCloseMenu}>
            <Tooltip key={"tt" + id}>
              <Box
                color={"success"}
                size="small"
                variant="outlined"
                onClick={(e) => {
                  let url = t.url;
                  if (e.ctrlKey) url = t.url.replace("xarprod", "xarval");
                  window.open(url, "_blank").focus();
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
                href="https://xarprod.ondemand.sas.com/lsaf/webdav/repo/general/biostat/apps/fileviewer/index.html?file=/general/biostat/apps/control/links.json"
                target="_blank"
                rel="noreferrer"
              >
                links.json
              </a>
            </li>
            <li>
              Most of the links will open an app in LSAF, but some open it in
              SharePoint.
            </li>
            <li>
              Clicking a link will open the app in LSAF PROD (if available) by
              default. Holding down the control key while clicking will open the
              app on VAL (if available)
            </li>
            <li>
              The things that are shown in Control are defined in{" "}
              <i>/general/biostat/apps/control/links.json</i>, e.g.
            </li>
            <code>
              "id": "backups",
              <br />
              "name": "🧻 Backups",
              <br />
              "description": "View the files that are backed up each day.",
              <br />
              "url":
              "https://xarprod.ondemand.sas.com/lsaf/webdav/repo/general/biostat/apps/view/index.html?lsaf=/general/biostat/apps/backups/backups.json&meta=/general/biostat/apps/backups/backups_meta.json&title=🧻%20Backups",
              <br />
              "group": "code"
            </code>
            <li>
              And there should be a screen shot for each link in
              /general/biostat/apps/control/img, which uses the id with a png
              suffix. e.g. <i>/general/biostat/apps/control/img/backups.png</i>
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
