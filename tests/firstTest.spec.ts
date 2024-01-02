import { expect, test } from "@playwright/test";

test.beforeEach("First test", async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntex rules", async ({ page }) => {
  // locate by element
  await page.locator("input").first().click();
  // locate by id
  await page.locator("#inputEmail1").click();
  // locate by class value
  page.locator(".shape-rectangle");
  // by attribute
  page.locator('[placeholder="Email"]');
  // locate by full class value
  page.locator(
    "[class=input-full-width size-medium status-basic shape-rectangle nb-transition]"
  );
  // combine different selectors
  page.locator('input[placeholder="Email"][nbinput]');
  // by XPath ( not recommended)
  page.locator('//*[@id="inputEmail1"]');
  // by partial text match
  page.locator(':text("Using")');
  // by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
  // by role
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  // best practice, but does not a user friendly test, because are not visual
  await page.getByTestId("SignIn").click();
  await page.getByText("Using the Grid").click();
  await page.getByTitle("IoT Dashboard").click();
});

test("Locating child elements", async ({ page }) => {
  // locating entering child elements with just one locator
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  // locating entering child elements with multiple locators
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();
  // locating entering child elements and getting by role and name
  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();
  // locating entering child elements and getting by nth index: starts from zero
  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating parent elements", async ({ page }) => {
  // search the element that has the text X
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // select parent element with locator match
  await page.locator("nb-card", { has: page.locator("#inputEmail1") }).click();
  // select parent element with filter and role
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // select a parent element with filter
  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
  // select parent element with multiple filters
  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign In" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // not recommended select parent element by a specific text and after return a element like a path and get other element from others childs inside the parent that you comeback
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  const passwordField = basicForm.getByRole("textbox", { name: "Password" });
  // select parent element with filter and role
  await emailField.fill("test@test.com");
  await passwordField.fill("123456");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("extracting values", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  // single text values
  const buttonText = await basicForm.locator("button").textContent();

  expect(buttonText).toEqual("Submit");
  // multiple text values
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");
  expect(allRadioButtonsLabels).toHaveLength(3);
  // input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");

  const placeholderEmail = await emailField.getAttribute("placeholder");
  expect(placeholderEmail).toBe("Email");
});
