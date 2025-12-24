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

    this.yearsOfExperience = page.locator('button[role="combobox"]');
    this.studentsRecruited = page.locator('input[type="number"]');
    this.focusArea = page.locator('input[name="focus_area"]');
    this.successMetric = page.locator('input[name="success_metrics"]');

    this.careerCounseling = page.locator('#«r85»-form-item');
    this.admissionApplications = page.locator('#«r86»-form-item');
    this.visaProcessing = page.locator('#«r87»-form-item');
    this.testPreparation = page.locator('#«r88»-form-item');
    this.nextButton = page.locator('button[type="submit"]');

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
 // Select Years of Experience (Radix combobox)
async selectYearsOfExperience(yearText) {
  await this.yearsOfExperience.click();
  await this.page.locator(`text="${yearText}"`).click();
}

// Select Services Provided
async selectServices(services = []) {
  if (services.includes('career')) {
    await this.careerCounseling.click();
  }

  if (services.includes('admission')) {
    await this.admissionApplications.click();
  }

  if (services.includes('visa')) {
    await this.visaProcessing.click();
  }

  if (services.includes('test')) {
    await this.testPreparation.click();
  }
}

// Click Next button
async clickNext() {
  await this.nextButton.click();
}
}

module.exports = { SignupPage };