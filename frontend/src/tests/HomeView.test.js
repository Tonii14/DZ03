import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeView from '../components/views/HomeView';

describe('HomeView', () => {
  it('should delete a row from the table', () => {
    // Arrange
    const mockLines = [
      {
        naziv: 'Zagreb - Dubrovnik',
        idLinije: '0',
        zracnaLukaPolaska: 'Zracna luka Franjo Tudman',
        zracnaLukaDolaska: 'Zracna luka Dubrovnik',
        kompanija: 'Croatia Airlines'
      },
      {
        naziv: 'Frankfurt - Rim',
        idLinije: '1',
        zracnaLukaPolaska: 'International Airport Frankfurt',
        zracnaLukaDolaska: 'Rome Fiumcino',
        kompanija: 'Ryanair'
      }
    ];

    render(<HomeView />);

    // Assert initial table row count
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(mockLines.length + 1); // +1 for the table header row

    // Act
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Assert table row count after deletion
    const updatedTableRows = screen.getAllByRole('row');
    expect(updatedTableRows).toHaveLength(mockLines.length); // Expects one row to be deleted
  });
});
