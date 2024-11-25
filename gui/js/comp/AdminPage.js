import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const baseFontSize = '16px';
const baseSpacing = '10px';
const baseBorderRadius = '5px';
const baseBorderColor = '#ddd';
const baseControlWidth = '200px';

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

const StyledControl = styled.div`
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
  width: 600px; /* Adjust width as needed for different screen sizes */
  padding: ${baseSpacing};
  flex: 1;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: left;
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
  width: ${baseControlWidth};
`;

const StyledInput = styled.input`
  padding: 5px;
  width: ${baseControlWidth} - ${baseBorderRadius};
  border: 1px solid ${baseBorderColor};
  border-radius: ${baseBorderRadius};
  flex: 1;
  font-size: ${baseFontSize};
`;

const StyledButton = styled.button`
  display: flex;
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: ${baseBorderRadius};
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#4CAF50')};
  color: white;
  font-weight: bold;
  font-size: 0.6em;
  cursor: pointer;
  position: relative; /* Required for positioning the tooltip */

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#ccc' : '#388E3C')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed; 
  }

  &:hover::after {
    content: attr(data-tooltip); /* Use the data-tooltip attribute for dynamic tooltips */
    position: absolute;
    bottom: 100%; /* Position above the button */
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 0.7em;
    z-index: 1;
    opacity: 1;
    visibility: visible;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 100%; /* Start hidden */
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 0.7em;
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
  }
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -5px;
`;

const ButtonWarning = styled.div`
  display: flex;
  button {
    background-color: red;
    color: white;
    &:hover {
      background-color: darkred; 
    }
  }
`;


const StyledSpan = styled.span`
  font-size: ${baseFontSize};
`;

const StyledOption = styled.option`
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
  }

  &[selected] {
    background-color: #ddd;
  }
`;

const StyledContainer = styled.div`
  display: flex;
`;


export {
  StyledControlPanel,
  StyledLabel,
  StyledSelect,
  StyledInput,
  StyledButton,
  StyledSpan,
  StyledOption,
  StyledForm,
  StyledControl,
  StyledContainer
};

import Config from "../configuration.json";
import { TimingController } from "./TimingController";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("../lang/en.json");
}

export function AdminPage(props) {

    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    const [updateDataFlag, setUpdateDataFlag] = useState(false);

    //timing sheet stuff
    //const [isLoading, setIsLoading] = useState(false); // State for loading indicator
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
  
  // Function to handle form submission
  // Function to handle form submission using query parameters
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        const response = await fetch(`${props.DSAPI}/api/event/addDriver?driverNumber=${driverNumber}&driver=${driver}&navigator=${navigator}&raceClass=${raceClass}&vehicle=${vehicle}`, {
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
    
    const handleDeleteAll = async () => {
    
      try {
        if(confirm("Are you sure you want to delete all entries? This action cannot be undone!")){

        const response = await fetch(`${props.DSAPI}/api/event/clearEntries`, {
          method: "DELETE",
        });
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        location.reload();
      }
      } catch (err) {
        console.error("Error deleting drivers:", err);
        setError(err.message);
      }
    };

    const handleDeleteAllRuns = async () => {
    
      try {
        if(confirm("Are you sure you want to delete all runs? This action cannot be undone!")){

        const response = await fetch(`${props.DSAPI}/api/event/deleteRuns`, {
          method: "DELETE",
        });
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        location.reload();
      }
      } catch (err) {
        console.error("Error deleting driver runs:", err);
        setError(err.message);
      }
    };

    const handleDeleteDriverRuns = async () => {
    
      try {
        if(confirm(`Are you sure you want to delete all runs for driver #${driverNumber}? This action cannot be undone!`)){
        
        console.log(`${props.DSAPI}/api/event/deleteRuns?driverNumber=${driverNumber}`);

        const response = await fetch(`${props.DSAPI}/api/event/deleteRuns?driverNumber=${driverNumber}`, {
          method: "DELETE"
        });
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        location.reload();
        }
      } catch (err) {
        console.error("Error deleting driver runs:", err);
        setError(err.message);
      }
    };

    const handleDeleteDriver = async () => {
    
      try {
        if(confirm("Are you sure you want to delete all runs? This action cannot be undone!")){

        const response = await fetch(`${props.DSAPI}/api/event/deleteRuns?driverNumber=${driverNumber}`, {
          method: "DELETE",
        });
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        location.reload();
      }
      } catch (err) {
        console.error("Error deleting driver runs:", err);
        setError(err.message);
      }
    };

    //flags to update table data
    const handleUpdateData = (state) => {
      // Update data logic (optional)
      setUpdateDataFlag(state);
    };

    // ... rest of your component (e.g., socket status, form)
  
    return (
      <>
        <StyledContainer>
          <StyledControlPanel>
            {error}
            {props.DSAPI ? (
            <TimingController API={props.API} DSAPI = {props.DSAPI}
                                socket={props.socket}
                                onUpdateData={handleUpdateData}
                                />
                              ) : <p>Loading Controller</p>}
            </StyledControlPanel>
            <StyledControlPanel>
            {/* Form for adding new driver */}
            <StyledForm onSubmit={handleSubmit}>
            <h3>Add Entry Form</h3>
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
             <ButtonContainer>
  <StyledButton type="submit" data-tooltip="Add or update an entry">
    Add/Update Entry
  </StyledButton>
  <ButtonWarning>
    <StyledButton 
      type="button" 
      data-tooltip="Delete the current driver"
      onClick={() => handleDeleteDriver()}
    >
      Delete Driver
    </StyledButton>
    <StyledButton 
      type="button" 
      data-tooltip="Delete all runs for the current driver"
      onClick={() => handleDeleteDriverRuns()}
    >
      Delete Driver Runs
    </StyledButton>
    <StyledButton 
      type="button" 
      data-tooltip="Delete all entries in the system"
      onClick={() => handleDeleteAll()}
    >
      Delete All Entries
    </StyledButton>
    <StyledButton 
      type="button" 
      data-tooltip="Delete all runs in the system"
      onClick={() => handleDeleteAllRuns()}
    >
      Delete All Runs
    </StyledButton>
  </ButtonWarning>
</ButtonContainer>

            </StyledForm>
          </StyledControlPanel>
          {/* Rest of your form or other elements */}
        </StyledContainer>
        </>

    );  
}

AdminPage.propTypes = {    
    requestData: PropTypes.func,
    API: PropTypes.string,
    socket: PropTypes.object,
};