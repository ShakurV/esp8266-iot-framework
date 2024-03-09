import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const baseFontSize = '16px';
const baseSpacing = '10px';
const baseBorderRadius = '5px';
const baseBackgroundColor = '#f5f5f5';
const baseBorderColor = '#ddd';

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

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const TableRow = styled.tr`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  &:nth-child(even) {
    background-color: #f0f0f0;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
`;

const StyledControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${baseSpacing};
  margin: 20px auto;
  width: 600px; /* Adjust width as needed for different screen sizes */
  border: 1px solid ${baseBorderColor};
  border-radius: ${baseBorderRadius};
  padding: ${baseSpacing};
  background-color: ${baseBackgroundColor};
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: ${baseFontSize};
  margin-bottom: 5px;
`;

const StyledSelect = styled.select`
  padding: 5px;
  border: 1px solid ${baseBorderColor};
  border-radius: ${baseBorderRadius};
  flex: 1;
  font-size: ${baseFontSize};
`;

const StyledInput = styled.input`
  padding: 5px;
  border: 1px solid ${baseBorderColor};
  border-radius: ${baseBorderRadius};
  flex: 1;
  font-size: ${baseFontSize};
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${baseBorderRadius};
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#4CAF50')};
  color: white;
  font-weight: bold;
  font-size: ${baseFontSize};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

const StyledSpan = styled.span`
  font-size: ${baseFontSize};
`;

const StyledOption = styled.option`
  /* Add your desired styles here */
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;

  /* Optional: Hover and selected states */
  &:hover {
    background-color: #f5f5f5;
  }

  &[selected] {
    background-color: #ddd;
  }
`;


export {
  StyledControlPanel,
  StyledLabel,
  StyledSelect,
  StyledInput,
  StyledButton,
  StyledSpan,
  StyledOption
};

import Config from "../configuration.json";
import { TimingController } from "./TimingController";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("../lang/en.json");
}

export function TimingPage(props) {

    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    //timing sheet stuff
    const [data, setData] = useState([]); // State to store API response
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State to handle errors

    //add driver form
    const [driverNumber, setDriverNumber] = useState("");
    const [driver, setDriver] = useState("");
    const [navigator, setNavigator] = useState("");
    const [raceClass, setRaceClass] = useState("");
    const [vehicle, setVehicle] = useState("");

    useEffect(() => {
        document.title = loc.titleTiming;
    }, []);

    // Fucntion to update connection status
    useEffect(() => {
        const timer = setTimeout(() => {
            setCounter(counter => counter + 1);
            if (!(socketStatus == 0 && props.socket.readyState != 1)) {
                setSocketStatus(props.socket.readyState);
            }
        }, 40); //refresh with 25FPS

        return () => clearTimeout(timer);

    }, [counter]);
  
    // Function to fetch data from the API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
  
      try {
        const response = await fetch(`${props.API}/api/event/getTimeSheet`);
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

  // Function to handle form submission
  // Function to handle form submission using query parameters
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        const response = await fetch(`${props.API}/api/event/addDriver?driverNumber=${driverNumber}&driver=${driver}&navigator=${navigator}&raceClass=${raceClass}&vehicle=${vehicle}`, {
          method: "POST",
        });
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        // Clear form fields after successful submission
        setDriverNumber("");
        setDriver("");
        setNavigator("");
        setRaceClass("");
        setVehicle("");
      
        location.reload();
      } catch (err) {
        console.error("Error adding driver:", err);
        setError(err.message);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);
  
    // Function to render table body rows
    const renderTableBody = () => {
      return data.map((row, index) => (
        <TableRow key={index}>
            {row.map((cell) => (
              <TableData key={cell}>{cell}</TableData>
            ))}
        </TableRow>
      ));
    };
  
    // ... rest of your component (e.g., socket status, form)
  
    return (
      <>
        <h2>
          {loc.titleTiming} {socketStatus != 0 ? (
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
        
        {/* Timing sheet */}
        {data.length > 0 && (
          <TableWrapper>
            <table>{renderTableBody()}</table>
          </TableWrapper>
        )}

        <h3>Controller</h3>
        <TimingController API={props.API} 
                            socket={props.socket}
                            sheetRefreshFunction={fetchData}
                            />

        <h3>Add Entry Form</h3>
        {/* Form for adding new driver */}
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel htmlFor="driverNumber">Driver Number:</StyledLabel>
          <StyledInput 
            type="number"
            id="driverNumber"
            value={driverNumber}
            onChange={(e) => setDriverNumber(e.target.value)}
          />
          <StyledLabel htmlFor="driver">Driver Name:</StyledLabel>
          <StyledInput 
            type="text"
            id="driver"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
          />
          <StyledLabel htmlFor="navigator">Navigator Name:</StyledLabel>
          <StyledInput 
            type="text"
            id="navigator"
            value={navigator}
            onChange={(e) => setNavigator(e.target.value)}
          />
          <StyledLabel htmlFor="raceClass">Race Class:</StyledLabel>
          <StyledInput 
            type="text"
            id="raceClass"
            value={raceClass}
            onChange={(e) => setRaceClass(e.target.value)}
          />
          <StyledLabel htmlFor="vehicle">Vehicle:</StyledLabel>
          <StyledInput 
            type="text"
            id="vehicle"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
          <StyledButton  type="submit">Add Entry</StyledButton >
        </StyledForm>
        {/* Rest of your form or other elements */}
        </>

    );
}

TimingPage.propTypes = {    
    requestData: PropTypes.func,
    API: PropTypes.string,
    socket: PropTypes.object,
};