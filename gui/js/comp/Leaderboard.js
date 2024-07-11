import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { JSONTable } from "./JSONTable";

import styled from "styled-components";

const baseFontSize = '16px';
const baseSpacing = '10px';
const baseBorderRadius = '5px';
const baseBorderColor = '#ddd';
const baseControlWidth = '200px';

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
  flex: 3;
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
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("../lang/en.json");
}

export function Leaderboard(props) {

    const [counter, setCounter] = useState(0);
    const [socketStatus, setSocketStatus] = useState(0);

    const [updateDataFlag, setUpdateDataFlag] = useState(false);

    //flags to update table data
    const handleUpdateData = (state) => {
      // Update data logic (optional)
      setUpdateDataFlag(state);
    };

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
  
  
    return (
      <>
        <StyledContainer>
            
          {/* Timing sheet */}
            <TableWrapper>
              
                <h2>
                Leaderboard
                {socketStatus != 0 ? (
                socketStatus === 1 ? (
                  <Live>{loc.dashLive}</Live>
                ) : (
                  <Disconnected>{loc.dashDisconn}</Disconnected>
                )
              ) : (
                <Connecting>{loc.dashConn}</Connecting>
              )}
                </h2>            
                  <JSONTable 
                    APIFetchCall={`${props.API}/api/event/getWinnerSheet`}
                    updateFlag={updateDataFlag}
                    onUpdateData={handleUpdateData}
                  />
              </TableWrapper>           
          {/* Rest of your form or other elements */}
        </StyledContainer>
        </>

    );
}

Leaderboard.propTypes = {    
    requestData: PropTypes.func,
    API: PropTypes.string,
    socket: PropTypes.object,
};