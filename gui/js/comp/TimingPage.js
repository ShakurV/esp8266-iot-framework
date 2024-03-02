import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Form } from "./UiComponents";
import styled from "styled-components";

const Live = styled.span`
    color:#c4e052 !important;
    border: 1px solid #c4e052;
    background-color:#e6f9b8;     
    border-radius:3px;
    font-size:0.5em !important;  
    padding:0.2em; 
    vertical-align:0.3em;
`;

const Connecting = styled.span`
    color:#ddd !important;
    border: 1px solid #ddd;
    background-color:#f4f4f4;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

const Disconnected = styled.span`
    color:#ff3333 !important;
    border: 1px solid #ff3333;
    background-color:#ffb3b3;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

const Table = styled.p`
    table, td, th{
        border: 1px solid black;
        border-collapse: collapse;
        padding: 10px;
        }
`;

import Config from "../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("../lang/en.json");
}

export function TimingPage(props) {

    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    useEffect(() => {
        document.title = loc.titleDash;
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCounter(counter => counter + 1);
            if (!(socketStatus == 0 && props.socket.readyState != 1)) {
                setSocketStatus(props.socket.readyState);
            }
        }, 40); //refresh with 25FPS

        return () => clearTimeout(timer);

    }, [counter]);

    const [data, setData] = useState([]); // State to store API response
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State to handle errors
  
    // Function to fetch data from the API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
  
      try {
        const response = await fetch("http://192.168.4.1/api/event/getTimeSheet");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // Function to render table body rows
    const renderTableBody = () => {
      return data.map((row, index) => (
        <tr key={index}>
          {row.map((cell) => (
            <td key={cell}>{cell}</td>
          ))}
        </tr>
      ));
    };
  
    // ... rest of your component (e.g., socket status, form)
  
    return (
      <>
        <h2>
          {loc.titleDash} {socketStatus != 0 ? (
            socketStatus === 1 ? (
              <Live>{loc.dashLive}</Live>
            ) : (
              <Disconnected>{loc.dashDisconn}</Disconnected>
            )
          ) : (
            <Connecting>{loc.dashConn}</Connecting>
          )}
        </h2>
        {isLoading && <p>Loading data...</p>}
        {error && <p>Error: {error}</p>}
        {data.length > 0 && (
          <Table>
            {/* Table header (replace with hard-coded values if desired) */}
            {/*<thead>
              <tr>
                <th>#</th>
                <th>Driver</th>
                <th>Navigator</th>
                <th>Class</th>
                <th>Vehicle</th>
                <th>Run 1</th>
                <th>Run 2</th>
                <th>Run 3</th>
                <th>Run 4</th>
              </tr>
        </thead>*/}
            <tbody>{renderTableBody()}</tbody>
          </Table>
        )}
        {/* Rest of your form or other elements */}
      </>
    );
}
/*
TimingPage.propTypes = {
    API: PropTypes.string,
    socket: PropTypes.object,
};
*/
TimingPage.propTypes = {    
    requestData: PropTypes.func,
    API: PropTypes.string,
    socket: PropTypes.object,
};