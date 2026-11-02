import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RoiCalculator from "./RoiCalculator";

describe("<RoiCalculator />", () => {
  it("renders initial state with simulator header, default budget, and metrics", () => {
    render(<RoiCalculator initialBudget={3000} initialNicheSlug="tecnologia" />);

    // Header and titles
    expect(screen.getByText("Simulador de Impacto e Retorno (ROI)")).toBeInTheDocument();
    expect(screen.getByText("Calcule o Retorno Real da Sua Campanha")).toBeInTheDocument();

    // Section labels
    expect(screen.getByText("1. Selecione o Nicho da Campanha")).toBeInTheDocument();
    expect(screen.getByText("2. Orçamento Disponível")).toBeInTheDocument();

    // Metric cards
    expect(screen.getByText("Retorno Financeiro Estimado")).toBeInTheDocument();
    expect(screen.getByText("CPM Efetivo")).toBeInTheDocument();
    expect(screen.getByText("CPC Estimado")).toBeInTheDocument();
    expect(screen.getByText("Impressões")).toBeInTheDocument();
    expect(screen.getByText("Cliques Estimados")).toBeInTheDocument();
    expect(screen.getByText("Vendas / Leads")).toBeInTheDocument();

    // Check CTA button contains initial budget
    expect(
      screen.getByRole("link", {
        name: /Criar Campanha com Esse Orçamento \(R\$ 3\.000\)/i,
      })
    ).toHaveAttribute("href", "/hub?budget=3000&niche=tecnologia");
  });

  it("updates calculations when a different niche is selected", () => {
    render(<RoiCalculator initialBudget={5000} initialNicheSlug="tecnologia" />);

    // Select Moda niche button
    const modaButton = screen.getByRole("button", { name: "Moda" });
    fireEvent.click(modaButton);

    // Verify CTR or CTA link updated to moda
    const ctaLink = screen.getByRole("link", {
      name: /Criar Campanha com Esse Orçamento/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/hub?budget=5000&niche=moda");
  });

  it("updates calculations when budget preset button is clicked", () => {
    render(<RoiCalculator initialBudget={1000} initialNicheSlug="tecnologia" />);

    // Click preset R$ 10.000
    const preset10k = screen.getByRole("button", { name: "R$ 10.000" });
    fireEvent.click(preset10k);

    // Check CTA link updated to 10000
    const ctaLink = screen.getByRole("link", {
      name: /Criar Campanha com Esse Orçamento \(R\$ 10\.000\)/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/hub?budget=10000&niche=tecnologia");
  });

  it("updates budget via number input", () => {
    render(<RoiCalculator initialBudget={2000} initialNicheSlug="fitness" />);

    const numberInput = screen.getByRole("spinbutton");
    fireEvent.change(numberInput, { target: { value: "8000" } });

    const ctaLink = screen.getByRole("link", {
      name: /Criar Campanha com Esse Orçamento \(R\$ 8\.000\)/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/hub?budget=8000&niche=fitness");
  });

  it("updates budget via range slider", () => {
    render(<RoiCalculator initialBudget={2000} initialNicheSlug="games" />);

    const budgetSlider = screen.getByLabelText("Orçamento da campanha");
    fireEvent.change(budgetSlider, { target: { value: "15000" } });

    const ctaLink = screen.getByRole("link", {
      name: /Criar Campanha com Esse Orçamento \(R\$ 15\.000\)/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/hub?budget=15000&niche=games");
  });

  it("allows defining custom reach target via checkbox and slider", () => {
    render(<RoiCalculator initialBudget={5000} initialNicheSlug="beleza" />);

    // Custom reach toggle
    const customReachToggle = screen.getByLabelText("Definir meta personalizada de alcance");
    expect(customReachToggle).not.toBeChecked();

    // Turn on custom reach
    fireEvent.click(customReachToggle);
    expect(customReachToggle).toBeChecked();

    // Verify custom reach slider appears
    const reachSlider = screen.getByLabelText("Meta de alcance de impressões");
    expect(reachSlider).toBeInTheDocument();

    // Change custom reach
    fireEvent.change(reachSlider, { target: { value: "250000" } });
    expect(screen.getByText("250.000 visualizações")).toBeInTheDocument();
  });

  it("resets values when Restaurar button is clicked", () => {
    render(<RoiCalculator initialBudget={3000} initialNicheSlug="tecnologia" />);

    // Change to Gastronomia and R$ 25.000
    const gastroButton = screen.getByRole("button", { name: "Gastronomia" });
    fireEvent.click(gastroButton);

    const preset25k = screen.getByRole("button", { name: "R$ 25.000" });
    fireEvent.click(preset25k);

    expect(
      screen.getByRole("link", {
        name: /Criar Campanha com Esse Orçamento \(R\$ 25\.000\)/i,
      })
    ).toHaveAttribute("href", "/hub?budget=25000&niche=gastronomia");

    // Click Restaurar
    const resetButton = screen.getByTitle("Restaurar valores padrão");
    fireEvent.click(resetButton);

    // Should return to initial budget R$ 3000 and tecnologia
    expect(
      screen.getByRole("link", {
        name: /Criar Campanha com Esse Orçamento \(R\$ 3\.000\)/i,
      })
    ).toHaveAttribute("href", "/hub?budget=3000&niche=tecnologia");
  });

  it("hides CTA when showCta is false", () => {
    render(<RoiCalculator showCta={false} />);

    expect(
      screen.queryByRole("link", {
        name: /Criar Campanha com Esse Orçamento/i,
      })
    ).not.toBeInTheDocument();
  });
});
