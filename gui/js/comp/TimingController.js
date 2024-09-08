import React, { useState, useEffect } from "react";
import {StyledControl, StyledForm, StyledLabel, StyledSelect, StyledInput, StyledButton, StyledSpan, StyledOption, StyledControlPanel, StyledContainer} from "./TimingPage";

export function TimingController(props) {
  const [data, setData] = useState([]); // State to store API response
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State to handle errors

  // Form state variables
  const [status, setStatus] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [driverList, setDriverList] = useState([]); // List of drivers
  const [lastTime, setLastTime] = useState("");

   // Function to fetch data from the API
   const fetchData = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();  
    // Assuming the data is JSON
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      return Promise.reject(err); // Propagate the error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatus = async () => {
     fetchData(`${props.API}/api/event/getStatus`).then(res => setStatus(res.status));
  };

  const fetchDriverList = async () => {
    //console.log("data server IP = "+ props.DSAPI)
    await fetchData(`${props.DSAPI}/api/event/getDriverNumberList`).then( res =>{
      if(res != undefined){
        setDriverList(Object.entries(res))
      }
    }
    )
  };

  const fetchLastTime = async () => {
    const lastTimeData = await fetchData(`${props.API}/api/event/getLastTime`);
    setLastTime(lastTimeData.lastTime);
  };

  // Effect to fetch initial data and set up refresh interval
  useEffect(() => {

    fetchStatus();
    console.log ("use effect says = dsapi " + props.DSAPI)
    fetchDriverList();
    fetchLastTime();

    // Set up interval to refresh data periodically
    const intervalId = setInterval(async () => {
      await fetchStatus();
      //await fetchLastTime();
    }, 5000); // 5 second interval

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  // Function to handle driver selection
  const handleDriverChange = (event) => {
    setDriverNumber(event.target.value);
  };

  // // Function to handle form submission (for future use)
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   // Implement form submission logic here
  // };

  // Function to handle button clicks (replace with actual API calls)
  const handleStartTimer = async () => {
    console.log("ligma");

    if (status !== 'Standby') {
      return; // Prevent action if not in Standby state
    }
  
    try {
      const response = await fetch(`${props.API}/api/event/startTiming`, {
        method: 'POST', // Use POST for sending data
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      console.log("Start timer response:", data); // Log the response for debugging
  
      // Clear the time field (replace with actual logic based on your UI)
      setLastTime("");
    } catch (error) {
      setError(error)
      console.error("Error starting timer:", error);
    }
  };

  const handleRecordTime = async () => {
    if (status !== 'Standby') {
      return; // Prevent action if not in Standby state
    }
  
    if (!driverNumber || !lastTime) {
      console.warn("Missing driver or time. Cannot record time.");
      return; // Prevent call if driver or time is missing
    }
  
    try {
      const baseURL = `${props.DSAPI}/api/event/addTime`;
      const url = `${baseURL}?driverNumber=${driverNumber}&time=${lastTime}`;
  
      const response = await fetch(url, {
        method: "POST",
      });
  
      alert(await response.text())

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }else{
        props.onUpdateData(true);
      }
  
      // You might want to display a success message or update UI state here
    } catch (error) {
      setError(error)
      console.error("Error recording time:", error);
    }

  };
  

  const handleStopTimer = async () => {
    if (status !== 'Running') {
      return; // Prevent action if not in Running state
    }
  
    try {
      const response = await fetch(`${props.API}/api/event/stopTiming`, {
        method: 'POST', // Use POST for sending data (might vary depending on your API)
      });
  
      if (!response.ok) {
        
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json(); // Handle response data (if needed)
  
      console.log("Stop timer response:", data); // Log the response for debugging
  
      // You might want to update the UI state or display a message here
    } catch (error) {
      console.error("Error stopping timer:", error);
    }

    fetchLastTime();
  };

  const handleRefresh = async () => {
    props.onUpdateData(true);
    fetchStatus();
    fetchDriverList();
    fetchLastTime();
  };

  const handleChange = (event) => {
    setLastTime(event.target.value);
  };

  // ... rest of your component (e.g., socket status)

  return (
    <StyledControl>
      <h3>Controller</h3>
      
      <StyledContainer>
        <StyledControlPanel>
          {/* <div>
            {error != null && <p>Error: {error}</p>}
          </div> */}
          {/* Status */}
        <div>
        <StyledLabel htmlFor="status">Status:</StyledLabel>
        <span id="status">{status}</span>
        </div>
          {/* Driver */}
          <div>
            <StyledLabel htmlFor="driver">Driver:</StyledLabel>
            <StyledSelect id="driver" onChange={handleDriverChange} value={driverNumber}>
              {driverList.map(([number, name]) => {
                return (
                  <StyledOption key={number} value={`${number}`}>
                    {number} - {name}
                  </StyledOption>
                );
              })}
            </StyledSelect>
            
          </div>
          {/* Time */}
          <div>
            <StyledLabel htmlFor="time">Time:</StyledLabel>
            <StyledInput id="time" type="text" value={lastTime} onChange={handleChange} />
          </div>
        </StyledControlPanel>
        {/* Buttons */}
        <StyledControlPanel>
          <StyledButton onClick={handleStartTimer} disabled={status !== 'Standby'}>Start Timer</StyledButton>
          <StyledButton onClick={handleRecordTime} /*disabled={status !== 'Standby'}*/>Record Time</StyledButton>
          <StyledButton onClick={handleStopTimer} disabled={status !== 'Running'}>Stop Timer</StyledButton>
          <StyledButton onClick={handleRefresh}>Refresh</StyledButton>
        </StyledControlPanel>
      </StyledContainer>
    </StyledControl>
  );
}
