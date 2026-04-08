import React from 'react';
import { render, screen } from '@testing-library/react';

// Mocks for next/navigation and next-auth
jest.mock('next/navigation', () => ({ usePathname: () => '/' }));
jest.mock('next-auth/react', () => ({ useSession: () => ({ data: null }) }));

import Navbar from '../navbar';

describe('Navbar', () => {
  it('renders the brand', () => {
    render(<Navbar />);
    expect(screen.getByText(/FairFund/i)).toBeInTheDocument();
  });
});
