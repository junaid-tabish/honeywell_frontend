import { render, screen, fireEvent } from '@testing-library/react';
import AddSite from './AddSite';

describe('AddSite', () => {
  it('should render AddSite component', () => {
    render(<AddSite />);
    const addSiteElement = screen.getByText(/Add Site/i);
    expect(addSiteElement).toBeInTheDocument();
  });


  
  it('should call Addsite function with correct data when submitting form', async () => {
    const mockAddSite = jest.fn();
    jest.mock('../../../Services/Admin/Sites/Controller', () => ({ Addsite: mockAddSite }));
    render(<AddSite />);
    const siteNameInput = screen.getByLabelText(/Site Name/i);
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    const distributorOption = screen.getByLabelText(/Distributor/i);
    const contractorOption = screen.getByLabelText(/Contractor/i);
    const statusOption = screen.getByRole('radio',{name:/status/i});
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(siteNameInput, { target: { value: 'Test Site' } });
    fireEvent.change(latitudeInput, { target: { value: '51.5074' } });
    fireEvent.change(longitudeInput, { target: { value: '0.1278' } });
    fireEvent.change(distributorOption, { target: { value: '73636ggg' } });
    fireEvent.change(contractorOption, { target: { value: 'hjhd77664' } });
    fireEvent.change(statusOption, { target: { value: '0' } });
    fireEvent.click(submitButton);
    expect(mockAddSite).toHaveBeenCalledWith({
      siteName: 'Test Site',
      latitude: '51.5074',
      longitude: '0.1278',
      status: '0',
      distributorId: '73636ggg',
      contractorId: 'hjhd77664',
    });
  });
});
