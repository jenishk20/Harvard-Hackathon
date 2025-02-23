const { storage, bucketName } = require("../config/gcs.js");
const visionClient = require("../config/visionConfig.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { compareTwoStrings } = require("string-similarity");
const User = require("../models/user");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const bucket = storage.bucket(bucketName);

async function validateInsuranceClaim(ocrText, formData) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  ACT AS AN INSURANCE CLAIM VALIDATOR(Dont be so strict). Analyze this medical bill and form submission:

  === MEDICAL BILL ===
  ${ocrText}

  === FORM DATA ===
  Patient Name: ${formData.name}
  Claim Amount: $${formData.amount}
  Reason: ${formData.reason}

  PERFORM THESE CHECKS:
  1. Verify patient name matches (allow minor typos)
  2. Confirm claim amount matches total bill amount ( Consider minor margin )
  3. Validate reason matches diagnosis/procedures (Dont be so strict here get intent of the treatment and match just it)

  RESPONSE FORMAT (ONLY JSON):
  {
      "isApproved": boolean,
      "reasons": {
          "nameMatch": boolean,
          "amountMatch": boolean,
          "reasonMatch": boolean,
          "notes": string

  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const cleanResponse = response.replace(/```json|```/g, "");
    const validationResult = JSON.parse(cleanResponse);

    return {
      isApproved: validationResult.isApproved,
      details: validationResult.reasons,
    };
  } catch (error) {
    return Promise.reject(`Validation failed: ${error.message}`);
  }
}
exports.extractData = async (req, res) => {
  try {
    if (!req.file) {
      console.log("No image uploaded");
      return res.status(400).json({ error: "No image uploaded." });
    }

    const fileName = `bill-ocr-${Date.now()}-${req.file.originalname}`;

    await bucket.file(fileName).save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const gcsUri = `gs://${bucketName}/${fileName}`;

    const [result] = await visionClient.textDetection(gcsUri);
    const text = result?.fullTextAnnotation?.text || "";

    const patientName = extractName(text);
    const totalAmount = extractAmount(text);
    const reason = req.body.reason;

    const objToPass = {
      name: patientName,
      amount: totalAmount,
      reason: reason,
    };

    const isValidClaim = await validateInsuranceClaim(text, objToPass);
    console.log(isValidClaim);
    if (isValidClaim?.isApproved) {
      const userId = req.body.userId;
      const policyId = req.body.policyId;

      const user = await User.findOne({ uid: userId });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      }

      const policy = user.policies.find((p) => {
        return p.planName === req.body.planName;
      });
      console.log("Policy", policy);

      if (!policy) {
        return res
          .status(404)
          .json({ success: false, error: "Policy not found." });
      }

      const newClaim = {
        amount: totalAmount,
        status: "pending",
        reason: reason,
      };

      policy.claims.push(newClaim);

      await user.save();

      return res.json({
        success: true,
        isValidClaim,
        rawText: text,
        message: "Claim has been successfully filed.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid claim data.",
      });
    }
  } catch (error) {
    console.error("Error in OCR extraction:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

function extractName(text) {
  const nameRegex = /Patient:\s(.+)/i;
  const match = text.match(nameRegex);
  return match ? match[1].trim() : null;
}

function extractAmount(text) {
  const amountRegex = /Total:\s?\$?([\d,]+)/i;
  const match = text.match(amountRegex);
  return match ? parseFloat(match[1].replace(/,/g, "")) : null;
}
