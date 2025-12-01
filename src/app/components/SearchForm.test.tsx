import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import SearchForm from "@/app/components/SearchForm";

// Mock the app router
const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("SearchForm", () => {
  it("renders the form", () => {
    render(<SearchForm />);

    // Check that the autocomplete input is in the document
    expect(
      screen.getByPlaceholderText(/Start typing a location/i)
    ).toBeInTheDocument();

    // Check that the submit button is in the document
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

