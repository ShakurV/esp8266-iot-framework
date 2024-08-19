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
  font-size: ${baseFontSize};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  width: ${baseControlWidth};
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
            <TimingController API={props.API} DSAPI = {props.DSAPI}
                                socket={props.socket}
                                onUpdateData={handleUpdateData}
                                />
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
            <StyledButton  type="submit">Add Entry</StyledButton >
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