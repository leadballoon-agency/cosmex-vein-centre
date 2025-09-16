// Assessment Testing Script
// This script simulates user interactions with the assessment tool

const puppeteer = require('puppeteer');

async function testAssessment() {
    let issues = [];

    console.log('Starting Assessment Tool Testing...\n');

    const browser = await puppeteer.launch({
        headless: false, // Set to true for headless testing
        defaultViewport: { width: 1280, height: 720 },
        slowMo: 500 // Slow down for visibility
    });

    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080');
        await page.waitForSelector('#assessment');

        // Test 1: Face Path
        console.log('🧪 Testing Face Path...');
        await testFacePath(page, issues);

        // Reset for next test
        await resetAssessment(page);

        // Test 2: Legs Varicose Path
        console.log('🧪 Testing Legs Varicose Path...');
        await testLegsVaricosePath(page, issues);

        // Reset for next test
        await resetAssessment(page);

        // Test 3: Legs Spider Path
        console.log('🧪 Testing Legs Spider Path...');
        await testLegsSpiderPath(page, issues);

        // Reset for next test
        await resetAssessment(page);

        // Test 4: Both Path
        console.log('🧪 Testing Both Path...');
        await testBothPath(page, issues);

        // Test 5: Navigation Tests
        console.log('🧪 Testing Navigation Features...');
        await testNavigation(page, issues);

    } catch (error) {
        issues.push(`Fatal Error: ${error.message}`);
    }

    await browser.close();

    // Report Results
    console.log('\n' + '='.repeat(50));
    console.log('ASSESSMENT TESTING RESULTS');
    console.log('='.repeat(50));

    if (issues.length === 0) {
        console.log('✅ All tests passed! No issues found.');
    } else {
        console.log(`❌ Found ${issues.length} issue(s):`);
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
    }
}

async function testFacePath(page, issues) {
    try {
        // Click to start assessment
        await page.click('a[href="#assessment"]');
        await page.waitForTimeout(1000);

        // Start assessment
        await page.waitForSelector('.assessment-welcome .cta-primary');
        await page.click('.assessment-welcome .cta-primary');

        // Select Face
        await page.waitForSelector('.option[data-value="face"]');
        await page.click('.option[data-value="face"]');

        // Check if face questions are showing
        const faceQuestion2 = await page.waitForSelector('.question[data-question="face-2"]', { timeout: 3000 });
        if (!faceQuestion2) {
            issues.push('Face path: Face question 2 not showing after selecting Face');
        }

        // Go through face questions
        const faceQuestions = ['face-2', 'face-3', 'face-4', 'face-5'];
        let questionCount = 0;

        for (const questionId of faceQuestions) {
            questionCount++;

            if (questionId === 'face-2') {
                // Select face areas (checkboxes)
                await page.click('.face-area-checkbox[value="cheeks"]');
                await page.click('.continue-button');
            } else {
                // Select first option for other face questions
                const options = await page.$$(`[data-question="${questionId}"] .face-option`);
                if (options.length > 0) {
                    await options[0].click();
                }
            }

            // Check progress bar
            const progressWidth = await page.$eval('#progressFill', el => el.style.width);
            const expectedProgress = (questionCount + 1) / 5 * 100;
            // Allow some tolerance for rounding
            if (Math.abs(parseInt(progressWidth) - expectedProgress) > 5) {
                issues.push(`Face path: Progress bar incorrect at question ${questionCount}. Expected ~${expectedProgress}%, got ${progressWidth}`);
            }
        }

        // Check final results
        await page.waitForSelector('#assessmentResults', { timeout: 5000 });
        const resultsVisible = await page.$eval('#assessmentResults', el =>
            window.getComputedStyle(el).display !== 'none'
        );

        if (!resultsVisible) {
            issues.push('Face path: Results not showing after completing all questions');
        }

        // Check if results mention facial treatment
        const resultsText = await page.$eval('#assessmentResults', el => el.textContent);
        if (!resultsText.toLowerCase().includes('facial')) {
            issues.push('Face path: Results do not mention facial treatment');
        }

        console.log('  ✅ Face path completed');

    } catch (error) {
        issues.push(`Face path error: ${error.message}`);
    }
}

async function testLegsVaricosePath(page, issues) {
    try {
        // Start assessment
        await startAssessment(page);

        // Select Legs
        await page.click('.option[data-value="legs"]');
        await page.waitForTimeout(500);

        // Select Varicose veins
        await page.click('.option[data-value="varicose"]');
        await page.waitForTimeout(500);

        // Select Moderate symptoms
        await page.click('.option[data-value="moderate"]');
        await page.waitForTimeout(500);

        // Continue through remaining questions
        // Question 4 (risk factors) - select "None"
        await page.click('#risk-none');
        await page.click('.continue-button');
        await page.waitForTimeout(500);

        // Question 5 (duration)
        const q5Options = await page.$$('.question[data-question="5"] .option');
        if (q5Options.length > 0) await q5Options[0].click();
        await page.waitForTimeout(500);

        // Question 6 (previous treatment)
        const q6Options = await page.$$('.question[data-question="6"] .option');
        if (q6Options.length > 0) await q6Options[0].click();
        await page.waitForTimeout(500);

        // Question 7 (urgency)
        const q7Options = await page.$$('.question[data-question="7"] .option');
        if (q7Options.length > 0) await q7Options[0].click();

        // Check results recommend duplex scan
        await page.waitForSelector('#assessmentResults', { timeout: 5000 });
        const resultsText = await page.$eval('#assessmentResults', el => el.textContent);
        if (!resultsText.toLowerCase().includes('ultrasound') && !resultsText.toLowerCase().includes('scan')) {
            issues.push('Legs varicose path: Results do not mention ultrasound/duplex scan');
        }

        console.log('  ✅ Legs varicose path completed');

    } catch (error) {
        issues.push(`Legs varicose path error: ${error.message}`);
    }
}

async function testLegsSpiderPath(page, issues) {
    try {
        // Start assessment
        await startAssessment(page);

        // Select Legs
        await page.click('.option[data-value="legs"]');
        await page.waitForTimeout(500);

        // Select Spider veins
        await page.click('.option[data-value="spider"]');
        await page.waitForTimeout(500);

        // Select No symptoms
        await page.click('.option[data-value="none"]');
        await page.waitForTimeout(500);

        // Select "None" for risk factors
        await page.click('#risk-none');
        await page.click('.continue-button');

        // Continue through remaining questions
        const q5Options = await page.$$('.question[data-question="5"] .option');
        if (q5Options.length > 0) await q5Options[0].click();
        await page.waitForTimeout(500);

        const q6Options = await page.$$('.question[data-question="6"] .option');
        if (q6Options.length > 0) await q6Options[0].click();
        await page.waitForTimeout(500);

        const q7Options = await page.$$('.question[data-question="7"] .option');
        if (q7Options.length > 0) await q7Options[0].click();

        // Check results offer choice
        await page.waitForSelector('#assessmentResults', { timeout: 5000 });
        const resultsText = await page.$eval('#assessmentResults', el => el.textContent);
        // Should offer treatment options for spider veins
        if (!resultsText.toLowerCase().includes('spider') && !resultsText.toLowerCase().includes('thread')) {
            issues.push('Legs spider path: Results do not mention spider/thread vein treatment');
        }

        console.log('  ✅ Legs spider path completed');

    } catch (error) {
        issues.push(`Legs spider path error: ${error.message}`);
    }
}

async function testBothPath(page, issues) {
    try {
        // Start assessment
        await startAssessment(page);

        // Select Both
        await page.click('.option[data-value="both"]');
        await page.waitForTimeout(1000);

        // Check if it goes to leg questions (Question 2 should be about vein type)
        const question2 = await page.$('.question[data-question="2"]');
        if (!question2) {
            issues.push('Both path: Does not proceed to Question 2 (leg questions)');
        } else {
            const isActive = await page.$eval('.question[data-question="2"]', el =>
                el.classList.contains('active')
            );
            if (!isActive) {
                issues.push('Both path: Question 2 (leg questions) not active after selecting Both');
            }
        }

        // Check it doesn't go to face questions
        const faceQuestion = await page.$('.question[data-question="face-2"]');
        if (faceQuestion) {
            const faceActive = await page.$eval('.question[data-question="face-2"]', el =>
                el.classList.contains('active')
            );
            if (faceActive) {
                issues.push('Both path: Incorrectly shows face questions instead of leg questions');
            }
        }

        console.log('  ✅ Both path completed');

    } catch (error) {
        issues.push(`Both path error: ${error.message}`);
    }
}

async function testNavigation(page, issues) {
    try {
        // Test back button
        await startAssessment(page);
        await page.click('.option[data-value="legs"]');
        await page.waitForTimeout(500);

        // Check back button is visible
        const backButtonVisible = await page.$eval('#backButton', el =>
            el.classList.contains('visible')
        );
        if (!backButtonVisible) {
            issues.push('Navigation: Back button not visible when it should be');
        }

        // Test back button functionality
        await page.click('#backButton');
        await page.waitForTimeout(500);

        const question1Active = await page.$eval('.question[data-question="1"]', el =>
            el.classList.contains('active')
        );
        if (!question1Active) {
            issues.push('Navigation: Back button does not return to previous question');
        }

        // Test ESC key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        const welcomeVisible = await page.$eval('#assessmentWelcome', el =>
            el.classList.contains('active')
        );
        if (!welcomeVisible) {
            issues.push('Navigation: ESC key does not reset assessment');
        }

        // Test progress bar
        await startAssessment(page);
        await page.click('.option[data-value="legs"]');

        const progressWidth = await page.$eval('#progressFill', el => el.style.width);
        if (!progressWidth || progressWidth === '0%') {
            issues.push('Navigation: Progress bar not updating');
        }

        // Test question counter
        const counterVisible = await page.$eval('#questionCounter', el =>
            window.getComputedStyle(el).display !== 'none'
        );
        if (!counterVisible) {
            issues.push('Navigation: Question counter not visible');
        }

        const counterText = await page.$eval('#questionCounter', el => el.textContent);
        if (!counterText.includes('Question 2')) {
            issues.push('Navigation: Question counter shows incorrect question number');
        }

        console.log('  ✅ Navigation tests completed');

    } catch (error) {
        issues.push(`Navigation error: ${error.message}`);
    }
}

async function startAssessment(page) {
    await page.click('a[href="#assessment"]');
    await page.waitForTimeout(1000);
    await page.waitForSelector('.assessment-welcome .cta-primary');
    await page.click('.assessment-welcome .cta-primary');
    await page.waitForTimeout(500);
}

async function resetAssessment(page) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
}

// Run the tests
testAssessment().catch(console.error);