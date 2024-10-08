import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import { FiBox as HeaderIcon } from "react-icons/fi";

import {GlobalStyle, Menu, Header, Page, Hamburger} from "./comp/UiComponents";
import { WifiPage } from "./comp/WifiPage";
import { ConfigPage } from "./comp/ConfigPage";
import { DashboardPage } from "./comp/DashboardPage";
import { FilePage } from "./comp/FilePage";
import { FirmwarePage } from "./comp/FirmwarePage";
import { TimingPage } from "./comp/TimingPage";
import { AdminPage } from "./comp/AdminPage";
import { Leaderboard } from "./comp/Leaderboard";



import { bin2obj } from "./functions/configHelpers";

import Config from "./configuration.json";
import Dash from "./dashboard.json";

let loc;


if (Config.find(entry => entry.name === "language")) {
    loc = require("./lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./lang/en.json");
}

let url = "http://192.168.4.188";

if (process.env.NODE_ENV === "production") {url = window.location.origin;}

if (process.env.NODE_ENV === "development") {require("preact/debug");}

const displayData = new Array();

function Root() {
    
    const [menu, setMenu] = useState(false);
    const [configData, setConfigData] = useState(new Object());
    const [binSize, setBinSize] = useState(0);
    const [socket, setSocket] = useState({});
    const [dataServerUrl, setDataServerUrl] = useState(null); // Initialize as null

    useEffect(() => {
        // const ws = new WebSocket(url.replace("http://","ws://").concat("/ws"));
        // ws.addEventListener("message", wsMessage);
        // setSocket(ws);
        fetchData() 
    }, []);

    // function wsMessage(event) {
    //     event.data.arrayBuffer().then((buffer) => {                
    //         const dv = new DataView(buffer, 0);
    //         const timestamp = dv.getUint32(0, true);
    //         displayData.push([timestamp, bin2obj(buffer.slice(4,buffer.byteLength), Dash)]);     
    //     });        
    // }

    function fetchData() {
        fetch(`${url}/api/config/get`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                setBinSize(data.byteLength);
                setConfigData(bin2obj(data, Config));
            })
            .then(() => {
                let configEntry = Config.find(entry => entry.name === "dataIP");
                setDataServerUrl( `http://${configEntry ? configEntry.value : "192.168.4.115"}` );
            })
    }
    console.log(configData["projectName"]);
    let projectName = configData["projectName"];
    if (typeof projectName === "undefined") {
        projectName = Config.find(entry => entry.name === "projectName") ? Config.find(entry => entry.name === "projectName").value : "ESP8266";
    }
    let projectVersion = configData["projectVersion"];
    if (typeof projectVersion === "undefined") {
        projectVersion = Config.find(entry => entry.name === "projectVersion") ? Config.find(entry => entry.name === "projectVersion").value : "";
    }
    // url = configData["hostIP"];
    // if (typeof projectVersion === "undefined") {
    //     projectVersion = Config.find(entry => entry.name === "dataIP") ? Config.find(entry => entry.name === "dataIP").value : "";
    // }

    // let dataServerUrl = `http://${configData["dataIP"]}`;
    // if (typeof dataServerUrl === "undefined") {
    //     dataServerUrl = `http://${Config.find(entry => entry.name === "dataIP") ? Config.find(entry => entry.name === "dataIP").value : "192.168.4.115"}`;
    // }

    let showAll = configData["showAllMenus"];
    if (typeof dataServerUrl === "undefined") {
        dataServerUrl = Config.find(entry => entry.name === "showAllMenus") ? Config.find(entry => entry.name === "showAllMenus").value : false;
    }

    return <><GlobalStyle />

        <BrowserRouter>

            <Header>
                <h1><HeaderIcon style={{verticalAlign:"-0.1em"}} /> {projectName} {projectVersion}</h1>

                <Hamburger onClick={() => setMenu(!menu)} />
                <Menu className={menu ? "" : "menuHidden"}>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/">{loc.titleAdmin}</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/timing">{loc.titleTiming}</NavLink></li>
                    <li><NavLink onClick={() => setMenu(false)} exact to="/leaderboard">{loc.titleLeaderboard}</NavLink></li>
                    {showAll && <li><NavLink onClick={() => setMenu(false)} exact to="/wifi">{loc.titleWifi}</NavLink></li>         }
                    {/*showAll && <li><NavLink onClick={() => setMenu(false)} exact to="/dashboard">{loc.titleDash}</NavLink></li>    */}
                    {showAll && <li><NavLink onClick={() => setMenu(false)} exact to="/config">{loc.titleConf}</NavLink></li>       }
                    {showAll && <li><NavLink onClick={() => setMenu(false)} exact to="/files">{loc.titleFile}</NavLink></li>        }
                    {showAll && <li><NavLink onClick={() => setMenu(false)} exact to="/firmware">{loc.titleFw}</NavLink></li>       }
                </Menu>

            </Header>
        
            <Page>
                <Switch>
                    <Route exact path="/files">
                        <FilePage API={url} />
                    </Route>
                    <Route exact path="/config">
                        <ConfigPage API={url} 
                            configData={configData}
                            binSize={binSize}
                            requestUpdate={fetchData} />
                    </Route>
                    {/* <Route exact path="/dashboard">
                        <DashboardPage API={url} 
                            socket={socket}
                            requestData={() => {return displayData;}} />
                    </Route> */}
                    <Route exact path="/timing">
                        <TimingPage API={dataServerUrl} 
                            socket={socket}
                            requestData={() => {return displayData;}}
                            />
                    </Route>
                    <Route exact path="/">
                        <AdminPage API={dataServerUrl} DSAPI = {dataServerUrl} 
                            socket={socket}
                            requestData={() => {return displayData;}}
                            />
                    </Route>
                    <Route exact path="/leaderboard">
                        <Leaderboard API={dataServerUrl} 
                            socket={socket}
                            requestData={() => {return displayData;}}
                            />
                    </Route>
                    <Route exact path="/firmware">
                        <FirmwarePage API={url} />
                    </Route>
                    <Route path="/wifi">
                        <WifiPage API={url} />
                    </Route>
                </Switch>
            </Page>

        </BrowserRouter>
    </>;

}



ReactDOM.render(<Root />, document.getElementById("root"));