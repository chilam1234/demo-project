import { screen, fireEvent } from "@testing-library/react";
import { getPage } from "next-page-tester";

describe("Login", () => {
  it("renders Login page", async () => {
    const { render } = await getPage({
      route: "/login",
    });

    render();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
});
