class SignupPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');
    this.phoneNumber = page.locator('input[name="phoneNumber"]');
    this.password = page.locator('input[name="password"]');
    this.confirmPassword= page.locator('input[name="confirmPassword"]');

    this.agencyName = page.locator('input[name="agency_name"]');
    this.agencyRole = page.locator('input[name="role_in_agency"]');
    this.agencyEmail = page.locator('input[name="agency_email"]');
    this.agencyWebsite = page.locator('input[name="agency_website"]');
    this.agencyAddress = page.locator('input[name="agency_address"]');
    this.regionButton = page.locator('button[role="combobox"]');

  }

  async fillPersonalDetails(firstName, lastName, phoneNumber, password, confirmPassword) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.phoneNumber.fill(phoneNumber);
    await this.password.fill(password);
    await this.confirmPassword.fill(confirmPassword);
  }

  async fillAgencyDetails(agencyName, agencyRole, agencyEmail, agencyWeb, agencyAddress) {
    await this.agencyName.fill(agencyName);
    await this.agencyRole.fill(agencyRole);
    await this.agencyEmail.fill(agencyEmail);
    await this.agencyWebsite.fill(agencyWeb);
    await this.agencyAddress.fill(agencyAddress);
  }

  async selectRegion(region) {
    await this.regionButton.click();
    const regionOption = this.page.locator(`text=${region}`);
    await regionOption.first().click();
  }
}

module.exports = { SignupPage };