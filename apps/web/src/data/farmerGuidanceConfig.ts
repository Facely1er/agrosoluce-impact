// Farmer-Friendly Guidance Configuration
// Plain language, supportive guidance for farmers about documentation
// Tone: supportive, non-accusatory, non-legal
// All content is stored here for easy editing without changing component logic

import type { DocType } from './expectedDocumentsConfig';

export interface FarmerGuidance {
  docType: DocType;
  farmer_explanation: string; // Plain language, reassuring explanation
  example_acceptance: string; // What is usually acceptable
  common_misunderstandings: string; // Common misunderstandings clarified
}

/**
 * Get farmer-friendly guidance for a specific document type
 */
export function getFarmerGuidance(docType: DocType | string): FarmerGuidance | null {
  return FARMER_GUIDANCE_CONFIG[docType as DocType] || null;
}

/**
 * Get farmer-friendly guidance for multiple document types
 */
export function getFarmerGuidanceForTypes(docTypes: (DocType | string)[]): FarmerGuidance[] {
  return docTypes
    .map(docType => getFarmerGuidance(docType))
    .filter((guidance): guidance is FarmerGuidance => guidance !== null);
}

/**
 * Static farmer-friendly guidance configuration
 * Maps each document type to supportive, plain-language guidance
 */
const FARMER_GUIDANCE_CONFIG: Record<DocType, FarmerGuidance> = {
  certification: {
    docType: 'certification',
    farmer_explanation: 'A certification is a document that shows your cooperative follows certain good practices. This could be for organic farming, fair trade, or other quality standards. Having a certification helps buyers understand that your cooperative meets important standards. If you have a certification, it means you\'re already doing good work - we just need to see the paper that proves it.',
    example_acceptance: 'What is usually acceptable: A photo or copy of your certification certificate is fine. It doesn\'t need to be the original paper. The certificate should show the name of your cooperative and the date it was issued. If the certificate has an expiration date, that\'s okay - we just need to see that it exists. Even if the certificate is in a local language, that\'s acceptable. If you don\'t have the certificate with you, a clear photo taken with a phone is perfectly fine.',
    common_misunderstandings: 'Some farmers worry that if they don\'t have a certification, they\'re in trouble. That\'s not true - certifications are helpful but not always required. Some farmers think they need expensive, official translations - you don\'t. A photo of the original certificate is enough. Others worry that an expired certificate is useless - while a current one is better, showing you had a certification in the past can still be helpful. Remember, this is about showing what you have, not about being perfect.',
  },
  policy: {
    docType: 'policy',
    farmer_explanation: 'A policy is a written statement that shows your cooperative has rules about important things like protecting the environment, treating workers fairly, or not using child labor. Think of it like a promise your cooperative makes about how it will operate. Having a policy shows buyers that your cooperative takes these matters seriously. If your cooperative has a policy document, that\'s great - we just need to see it or know about it.',
    example_acceptance: 'What is usually acceptable: A written policy document, even if it\'s simple, is acceptable. It doesn\'t need to be a long, complicated legal document. A policy can be handwritten or typed. It should mention what the policy is about (like "we don\'t use child labor" or "we protect the environment"). If someone from your cooperative signed it, that\'s helpful but not always required. A photo of the policy document is fine. If your cooperative doesn\'t have a written policy yet, you can work with your cooperative leaders to create one - it doesn\'t have to be complicated.',
    common_misunderstandings: 'Some farmers think a policy needs to be a long, legal document written by a lawyer. That\'s not true - a simple, clear statement is enough. Others worry that if they don\'t have a policy written down, they\'re doing something wrong. That\'s not the case - many cooperatives operate well without written policies, and creating one is just a way to show your commitment. Some farmers think policies are about accusing them of doing bad things - policies are actually about showing the good things your cooperative is committed to doing. This is about support, not suspicion.',
  },
  land_evidence: {
    docType: 'land_evidence',
    farmer_explanation: 'Land evidence is information that shows where your crops are grown and that you have the right to use that land. This helps buyers understand where their products come from and that everything is legal. This is especially important for regulations that protect forests and ensure farmers have proper land rights. If you have documents about your land or can show where your fields are located, that\'s what we\'re looking for.',
    example_acceptance: 'What is usually acceptable: Many different things can work as land evidence. This could be a land title, a land use certificate, a document from local authorities, or even a map showing where your fields are. If you have GPS coordinates for your fields (from a phone), that can be helpful too. Photos of your fields with landmarks can also work. If you don\'t have official land documents, a statement from your cooperative or local authorities about land use can be acceptable. The important thing is showing where the crops come from, not having perfect legal documents.',
    common_misunderstandings: 'Some farmers worry that if they don\'t have a formal land title, they can\'t provide land evidence. That\'s not true - many farmers use land with permission from communities or families, and that\'s acceptable. Others think they need expensive surveys or legal documents - simple maps, photos, or statements are often enough. Some farmers are concerned that providing land information will cause problems - this information is just to help buyers understand where products come from, not to cause legal issues. If you\'re farming on family land or community land, that\'s perfectly valid - we just need to know about it.',
  },
  other: {
    docType: 'other',
    farmer_explanation: 'Sometimes buyers or cooperatives need other types of documents that don\'t fit into the main categories. This could be training certificates, quality records, or other documents specific to your situation. The important thing is understanding what document is needed and why. If someone asks for a document you\'re not familiar with, don\'t worry - just ask what it\'s for and whether there\'s a simple way to provide it.',
    example_acceptance: 'What is usually acceptable: For other documents, it depends on what\'s being asked for. Generally, if you have any document related to what\'s being requested, that\'s a good start. Photos are usually acceptable. If you don\'t have the exact document, ask if there\'s an alternative that would work. Many times, a simple statement or explanation can be acceptable if a formal document isn\'t available. The key is communication - if you\'re not sure what\'s needed, it\'s okay to ask for clarification.',
    common_misunderstandings: 'Some farmers worry that if they don\'t have a specific document, they\'ve failed. That\'s not true - many documents are optional or can be created. Others think every document needs to be perfect and official - simple, clear documents are often enough. Some farmers are afraid to ask questions about what\'s needed - asking questions is actually helpful and shows you want to provide the right information. Remember, the goal is to help, not to create obstacles.',
  },
};

