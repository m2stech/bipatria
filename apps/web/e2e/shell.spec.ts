import { expect, test } from "@playwright/test";

test("a página inicial lista os módulos", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/BI Pátria/);
  const modules = page.getByRole("navigation", { name: "Módulos" });
  for (const name of ["Aéreo", "Terrestre", "Operadora"]) {
    await expect(modules.getByRole("link", { name: new RegExp(name) })).toBeVisible();
  }
});

test("navega entre módulos e páginas pela barra de ícones", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Aéreo/ }).click();
  await expect(page).toHaveURL(/\/aereo\/capa$/);

  await page
    .getByRole("navigation", { name: "Páginas de Aéreo" })
    .getByRole("link", { name: /Vendas/ })
    .click();
  await expect(page).toHaveURL(/\/aereo\/vendas$/);
  await expect(page.getByRole("region", { name: "Vendas" })).toHaveAttribute(
    "data-canvas",
    "standard",
  );

  const path = testInfo.outputPath("shell-aereo-vendas.png");
  await page.screenshot({ path });
  await testInfo.attach("shell-aereo-vendas", { path, contentType: "image/png" });
});

test("xray usa o canvas vertical 1600 × 4700", async ({ page }) => {
  await page.goto("/aereo/xray");
  await expect(page.getByRole("region", { name: "xray" })).toHaveAttribute("data-canvas", "xray");
});

test("rotas inexistentes mostram a página não encontrada", async ({ page }) => {
  await page.goto("/terrestre/xray");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  await expect(page.getByRole("region", { name: "xray" })).toHaveCount(0);
});

test("login e administração são placeholders acessíveis", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Administração/ }).first()).toBeVisible();
});
