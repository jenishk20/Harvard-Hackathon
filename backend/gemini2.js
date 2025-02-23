const { GoogleGenerativeAI } = require("@google/generative-ai");
const { compareTwoStrings } = require("string-similarity");

// 1. Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI('AIzaSyDXyQSG-UPkg8-IuBq_UXxmhLOicZUcz38'); // ← Replace with actual key

async function validateInsuranceClaim(ocrText, formData) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    ACT AS AN INSURANCE CLAIM VALIDATOR. Analyze this medical bill and form submission:

    === MEDICAL BILL ===
    ${ocrText}

    === FORM DATA ===
    Patient Name: ${formData.name}
    Claim Amount: $${formData.amount}
    Reason: ${formData.reason}

    PERFORM THESE CHECKS:
    1. Verify patient name matches (allow minor typos)
    2. Confirm claim amount matches total bill amount
    3. Validate reason matches diagnosis/procedures (Dont be too strict)

    RESPONSE FORMAT (ONLY JSON):
    {
        "isApproved": boolean,
        "reasons": {
            "nameMatch": boolean,
            "amountMatch": boolean,
            "reasonMatch": boolean,
            "notes": string
        }
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        const cleanResponse = response.replace(/```json|```/g, '');
        const validationResult = JSON.parse(cleanResponse);

        // Additional validation
        const amountValid = validateAmount(ocrText, formData.amount);
        const nameValid = validateName(ocrText, formData.name);

        return {
            isApproved: validationResult.isApproved && amountValid && nameValid,
            details: validationResult.reasons
        };
    } catch (error) {
        return Promise.reject(`Validation failed: ${error.message}`);
    }
}

// Helper functions
function validateName(ocrText, formName) {
    const nameRegex = /PATIENT INFORMATION\n([^\n]+)/i;
    const billName = ocrText.match(nameRegex)?.[1]?.trim() || "";
    return compareTwoStrings(formName.toLowerCase(), billName.toLowerCase()) >= 0.85;
}

function validateAmount(ocrText, formAmount) {
    const amountRegex = /TOTAL\s*\$\s*([\d,]+\.\d{2})/i;
    const billAmount = parseFloat(ocrText.match(amountRegex)?.[1]?.replace(/,/g, '') || 0);
    return Math.abs(billAmount - formAmount) <= 1.0;
}

ocr_t = "MEDICAL BILLING INVOICE\nPATIENT INFORMATION\nKemba Harris\n(555) 595-5999\n11 Rosewood Drive,\nCollingwood, NY 33580\nPERSCRIBING PHYSICIAN'S INFORMATION\nDr. Alanah Gomez\n(555) 505-5000\n102 Trope Street,\nNew York, NY 45568\nINVOICE NUMBER\n12245\nITEM\nDATE\nINVOICE DUE DATE\n07/01/23\n07/30/23\nDESCRIPTION\nAmount DUE\n$1,745.00\nAMOUNT\nFull Check Up\nEar & Throat Examination\nFull body check up\n$745.00\n$1,000.00\nInfection check due to inflammation\nNOTES\nA prescription has been written out for patient,\nfor an acute throat infection.\nSUB TOTAL\n$745.00\nTAX RATE\n9%\nTAX\n$157.05\nTOTAL $1,902.05\nConcordia Hill Hospital\nwww.concordiahill.com\nFor more information or any issues or concerns,\nemail us at invoices@concordiahill.com"
validateInsuranceClaim(ocr_t, { name: "Kemba Harris", amount: 1902.05, reason: " full check-up, ear & throat examination, and an infection check" }).then(console.log).catch(console.error);