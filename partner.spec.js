import test, { expect, chromium } from "@playwright/test";
import { SignupPage } from "../pages/signuppage.js";
import testdata from '../test-data/testdata.json';
import MailosaurClient from 'mailosaur';
import path from 'path';
require('dotenv').config();

test.describe('Signup Test', async () => {
  let signuppage;
  let browser;
  let context;
  let page;
  test.setTimeout(120000);

  test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    signuppage = new SignupPage(page);
    await page.goto(process.env.BASE_URL); 
    });
    const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY);
    const serverId = 'b7clpa9e';


  test('Signup user with automated OTP', async () => {
    const testEmail = `user-${Date.now()}@${serverId}.mailosaur.net`;

    await page.getByRole('link', { name: 'Get Started' }).click();
    await page.locator('button[role="checkbox"]').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    //SignupPage to fill personal details
    await signuppage.fillPersonalDetails(testdata.firstName, testdata.lastName, testdata.phoneNumber, testdata.password, testdata.confirmPassword);
    await page.fill('input[type="email"]', testEmail); 
    await page.getByRole('button', { name: 'Next' }).click();
    const otpRequestTime = new Date();
    
    // Email Verification OTP
    console.log(`OTP email sent to: ${testEmail}`);
    const email = await mailosaur.messages.get(
    serverId,
    {
        sentTo: testEmail,
        receivedAfter: otpRequestTime
    },
    {
        timeout: 120000,
    }
    );

    console.log('Email received:', email.subject);

    // Safely extract OTP
    const otp =
    email.html?.codes?.[0]?.value
    // email.text?.codes?.[0]?.value;

    if (!otp) {
    console.log('Email text body:', email.text?.body);
    console.log('Email HTML body:', email.html?.body);
    throw new Error('OTP not found in email');
    }

    console.log('OTP received:', otp);

    // Fill OTP and verify
    const otpInput = page.locator('input[autocomplete="one-time-code"]');
    await otpInput.waitFor({ timeout: 50000 });
    await otpInput.fill(otp);
    await Promise.all([
     page.waitForLoadState('networkidle'),
    page.getByRole('button', { name: 'Verify Code' }).click()
    ]);

    //After Otp Verication >> Agency detail
    await page.waitForSelector('text=About your Agency', { timeout: 30000 });
    await signuppage.fillAgencyDetails(testdata.agencyName, testdata.agencyRole, testdata.agencyEmail, testdata.agencyWeb, testdata.agencyAddress);
    await signuppage.selectRegion('Australia');
    await page.locator('button[type="submit"]').click();

    // After Agency detail >> Professional Experience
    await page.waitForSelector('text=Experience and Performance Metrics', { timeout: 30000 });
    await page.locator('text=Select Your Experience Level').click();
    await page.locator('div[role="option"]', {hasText:'3 year'}).click();    
    await page.fill('input[name="number_of_students_recruited_annually"]', '120');
    await page.fill('input[name="focus_area"]', "Abroad Study");
    await page.fill('input[name="success_metrics"]', "80");
    await page.locator('text=Career Counseling').click();
    await page.locator('text=Admission Applications').click();
    await page.locator('text=Visa Processing').click();
    await page.locator('text=Test Prepration').click();

    await page.locator('button[type="submit"]').click();

    // After Professional Experience >> Verification and Preferences
    await page.waitForSelector('text=Provide Business Details and Set Preferences', { timeout: 30000 });

    await page.locator('input[placeholder="Enter your registration number"]').fill('BRN-123456');
    await page.locator('text=Select Your Preferred Countries').click();
    await page.locator('text=Australia').first().click();

    await page.locator('text=Universities').click();
    await page.locator('text=Colleges').click();
    await page.locator('text=Vocational School').click();
    await page.locator('text=Other').click();


    await page.locator('input[name="certification_details"]').fill("Home Minister");

    const businessDocPath = path.resolve('C:/Users/DELL/Desktop/document1.pdf');
    const educationDocPath = path.resolve('C:/Users/Dell/Desktop/document2.pdf');

    // Upload Company Registration Document
    await page.locator('input[type="file"]').first().setInputFiles(businessDocPath);

    // Upload Educational Certificate
    await page.locator('input[type="file"]').nth(1).setInputFiles(educationDocPath);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('https://authorized-partner.vercel.app/admin/profile', {
            timeout: 18000,
      });
});
});