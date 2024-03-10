import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

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

export function JSONTable(props) {
    //timing sheet stuff
    const [data, setData] = useState([]); // State to store API response
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State to handle errors

  
    // Function to fetch data from the API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
  
      try {
        const response = await fetch(`${props.APIFetchCall}`);
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
      if (props.updateFlag) {
        fetchData();
        props.onUpdateData(false);
      }
    }, [props.updateFlag]);

    useEffect(() => {
      fetchData();
    }, []);
  
    // Function to render table body rows
    const renderTableBody = () => {
      return data.map((row, index) => (
        <TableRow key={index}>
            {row.map((cell) => (
              <TableData>{cell}</TableData>
            ))}
        </TableRow>
      ));
    };
    
    return (
      <>
          {/* sheet */}
          {data.length > 0 && (
            <>
              {isLoading && <p>Loading data...</p>}
              {error && <p>Error: {error}</p>}
              <table>{renderTableBody()}</table>
            </>
          )}
        </>

    );
}

JSONTable.propTypes = {    
    API: PropTypes.string,
};