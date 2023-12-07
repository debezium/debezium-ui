import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from './AppHeader';

describe('AppHeader', () => {
  it('should render the logo', () => {
    it('should render the logo', () => {
      render(
        <AppHeader
          updateCluster={() => {}}
          notificationBadge={null} // Placeholder value for notificationBadge prop
        />
      );

      it('should render the toggle button', () => {
        render(<AppHeader updateCluster={() => {}} notificationBadge={null} />);
        const toggleButton = screen.getByRole('button', { name: 'Global navigation' });
        expect(toggleButton).toBeInTheDocument();
      });

      it('should call toggleSidebar when the toggle button is clicked', () => {
        const toggleSidebar = jest.fn();
        render(<AppHeader updateCluster={() => {}} notificationBadge={null} />);
        const toggleButton = screen.getByRole('button', { name: 'Global navigation' });
        userEvent.click(toggleButton);
        expect(toggleSidebar).toHaveBeenCalled();
      });
      // expect(toggleSidebar).toHaveBeenCalled();
    });
  });
});
