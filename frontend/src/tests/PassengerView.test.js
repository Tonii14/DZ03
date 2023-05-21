import React from 'react';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PassengersView from '../components/views/PassengersView';
import { MemoryRouter, Route, Routes} from 'react-router-dom';

test('renders PassengersView component', async () => {
    render(
        <MemoryRouter initialEntries={['/passengers']}>
          <Routes>
            <Route path="/passengers" element={<PassengersView />} />
            <Route path="/passengers/addPassenger" element={<div>Add Passenger Form</div>} />
          </Routes>
        </MemoryRouter>
    );
  // Assert that the component renders without errors
  const passengersViewElement = screen.getByTestId('passengers-view');
  expect(passengersViewElement).toBeInTheDocument();

  // Assert that the flights are displayed
  const flightOptions = screen.getAllByRole('option');
  expect(flightOptions.length).toBe(4); // Includes the default disabled option

  // Assert that the passengers are displayed
  await waitFor(() => {
    const passengerRows = screen.getAllByRole('row');
    expect(passengerRows.length).toBeGreaterThan(0);
  });

  // Simulate selecting a flight option
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });

  // Assert that the selected flight updates the passengers
  const updatedPassengers = screen.getAllByRole('row');
  expect(updatedPassengers.length-1).toBeGreaterThan(0); // Excludes the table header row

  // Simulate searching for a passenger
  fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Petar' } });

  // Assert that the search filters the passengers
  const filteredPassengers = screen.getAllByRole('row');
  expect(filteredPassengers.length).toBe(2); // Excludes the table header row

  // Simulate clicking the "Add new" button
  fireEvent.click(screen.getByText('Add new +'));

  // Assert that the component navigates to the add passenger form
  const addPassengerForm = screen.getByText('Add Passenger Form');
  expect(addPassengerForm).toBeInTheDocument();
});
