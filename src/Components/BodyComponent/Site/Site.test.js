import { BrowserRouter, Switch } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Site from "./Site.jsx";
describe("Site component", () => {
  it("should display sites", () => {
    jest.mock("../../../Services/Admin/Sites/Controller", () => ({
      Getsite: jest.fn().mockResolvedValue({
        data: {
          data: [],
        },
      }),
    }));
  });
  it("delete sites", () => {
    jest.mock("../../../Services/Admin/Sites/Controller", () => ({
      Deletesite: jest.fn().mockResolvedValue({
        data: {
          status: 1,
          message: "Site deleted successfully",
        },
      }),
    }));
  });
  it("shows the add site button", async () => {
    const localStorageMock = () => {
      let store = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2Y3MmYwNDhlYTQyYjRlZGQzMTc2ODEiLCJ1c2VyUm9sZSI6IkRpc3RyaWJ1dG9yIiwiaWF0IjoxNjc4MzU2NTAyLCJleHAiOjE2Nzg0NDI5MDJ9.POkzQ9hGOH41D_HjM677poZkvqhBF0MnGVYzavh2THI",
        role: "Distributor",
      };
      render(<Site />);
      // render(<Button>Click me!</Button>);
    const buttonElement = screen.getByRole('button', { name: '/Add/i' });  
    expect(buttonElement).toBeInTheDocument();
      // await waitFor(() => {
      //   expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
      // });
    };
  });

  it('deletes sites button', async () => {
    const localStorageMock = () => {
      let store = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2Y3MmYwNDhlYTQyYjRlZGQzMTc2ODEiLCJ1c2VyUm9sZSI6IkRpc3RyaWJ1dG9yIiwiaWF0IjoxNjc4MzU2NTAyLCJleHAiOjE2Nzg0NDI5MDJ9.POkzQ9hGOH41D_HjM677poZkvqhBF0MnGVYzavh2THI",
        role: "Distributor",
      };
   render(<Site />);
    const deleteButton =screen.getByTestId("btn-1");
    fireEvent.click(deleteButton);
  
      expect(screen.getByText(/are you sure you want to delete this site\?/i)).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(confirmButton);
      expect(screen.getByText(/site deleted successfully/i)).toBeInTheDocument();
  
    };
  });

});
