import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieTheater.css'; // Import the CSS file for styling

const MovieTheater = () => {
  const [rowCount, setRowCount] = useState(3); // Number of rows in the movie theater
  const [seats, setSeats] = useState([]); // Available seats fetched from the API
  const [selectedSeats, setSelectedSeats] = useState([]); // Seats selected by the user
  const [totalCost, setTotalCost] = useState(0); // Total cost of the selected seats

  useEffect(() => {
    // Fetch the seats data from the API
    const fetchSeats = () => {
      // const response = await axios.get(`https://codebuddy.review/seats?count=${rowCount}`);
      // setSeats(response.data);
      
      // Commented out API call to fetch the seats data
      const seatsData = [];
      for (let row = 1; row <= rowCount; row++) {
        for (let number = 1; number <= row; number++) {
          const isPrime = checkIsPrime(number);
          seatsData.push({ id: `${row}-${number}`, number, row, reserved: isPrime });
        }
      }
      setSeats(seatsData);
    };

    fetchSeats();
  }, [rowCount]);

  const checkIsPrime = (num) => {
    if (num === 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Handle seat selection by the user
  const handleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // Seat is already selected, remove it from the selection
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else if (selectedSeats.length < 5) {
      // Seat is not selected and maximum selection limit is not reached, add it to the selection
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  console.log("🚀 ~ file: MovieTheater.js:52 ~ submitSelectedSeats ~ selectedSeats:", selectedSeats)

  // Submit selected seats to the server
  const submitSelectedSeats = async () => {
    try {
      const selectedSeatDetails = selectedSeats.map((seatId) => {
        const seat = seats.find((seat) => seat.id === seatId);
        if (seat) {
          return {
            number: seat.number,
            reserved: seat.reserved,
            row: seat.row,
          };
        }
        return null;
      });
  
      // const response = await axios.post('https://codebuddy.review/submit', selectedSeatDetails);
      // Commented out API call to submit reserved seats
      console.log('Selected seats submitted successfully!', selectedSeatDetails);
    } catch (error) {
      console.error('Error submitting selected seats:', error);
    }
  };
  
  // Calculate the total cost of the selected seats
  useEffect(() => {
    let cost = 0;
    selectedSeats.forEach((seatId) => {
      const seat = seats.find((seat) => seat.id === seatId);
      if (seat) {
        cost += seat.row * 10 + 20; // Cost of seat is 10 * row + 20
      }
    });
    setTotalCost(cost);
  }, [selectedSeats, seats]);

  // Render the seats row-wise
  const renderSeats = () => {
    const rows = [];

    for (let row = rowCount; row >= 1; row--) {
      const rowSeats = seats.filter((seat) => seat.row === row);
      rows.push(
        <div key={`row-${row}`}>
          {rowSeats.map((seat) => (
            <button
              key={`seat-${seat.id}`}
              disabled={seat.reserved}
              className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatSelection(seat.id)}
            >
              Seat {seat.number}
              <br />
              Row {seat.row}
            </button>
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <div>
      <label htmlFor="rowCount">Number of Rows:</label>
      <input
        type="number"
        id="rowCount"
        min={3}
        max={10}
        value={rowCount}
        onChange={(e) => setRowCount(Number(e.target.value))}
      />
      <button onClick={() => setSelectedSeats([])}>Reset Selection</button>
      <div className="theater">{renderSeats()}</div>
      <div>
        <h3>Total Cost: ${totalCost}</h3>
        <button onClick={submitSelectedSeats}>Submit Selected Seats</button>
      </div>
    </div>
  );
};

export default MovieTheater;
