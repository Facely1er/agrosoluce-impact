// Field Officer Toolkit Content Model
// Static content for field officers and cooperative administrators
// All content is stored here for easy editing without changing component logic

export interface ToolkitSection {
  section_title: string;
  section_body: string; // Plain text or markdown
}

export interface FieldOfficerToolkit {
  toolkit_id: string;
  title: string;
  audience: 'field_officer' | 'coop_admin' | 'both';
  sections: ToolkitSection[];
  language: string; // Default "en"
}

/**
 * Get toolkit content by ID
 */
export function getToolkitById(toolkitId: string): FieldOfficerToolkit | null {
  return TOOLKIT_CONTENT.find(toolkit => toolkit.toolkit_id === toolkitId) || null;
}

/**
 * Get toolkits by audience
 */
export function getToolkitsByAudience(audience: 'field_officer' | 'coop_admin' | 'both'): FieldOfficerToolkit[] {
  return TOOLKIT_CONTENT.filter(toolkit => 
    toolkit.audience === audience || toolkit.audience === 'both'
  );
}

/**
 * Get toolkits by language
 */
export function getToolkitsByLanguage(language: string = 'en'): FieldOfficerToolkit[] {
  return TOOLKIT_CONTENT.filter(toolkit => toolkit.language === language);
}

/**
 * Static toolkit content
 */
const TOOLKIT_CONTENT: FieldOfficerToolkit[] = [
  {
    toolkit_id: 'field-officer-basics',
    title: 'Field Officer Toolkit: Documentation Guide',
    audience: 'field_officer',
    language: 'en',
    sections: [
      {
        section_title: 'Why Documentation Is Requested',
        section_body: `Buyers request documentation as part of their due-diligence process to verify that cooperatives meet certain standards and requirements. This documentation helps buyers:

- Verify compliance with regulations (such as EUDR, child labor laws)
- Assess environmental and social practices
- Confirm legal land use and origin of products
- Support their own reporting and certification needs

Documentation is not used to penalize cooperatives, but rather to help buyers make informed decisions and demonstrate their own compliance with regulations. Providing complete and accurate documentation can help cooperatives access more markets and build stronger relationships with buyers.`
      },
      {
        section_title: 'Acceptable Document Examples',
        section_body: `The following are examples of acceptable documents for each type:

**Certification Documents:**
- Organic certification certificates (photos of certificates are acceptable)
- Fair Trade certification documents
- Rainforest Alliance certificates
- Other third-party certification documents
- Photos of certification certificates are allowed if original documents are not available

**Policy Documents:**
- Environmental policy statements (signed and dated)
- Child labor policy documents
- Deforestation policy statements
- Supplier code of conduct documents
- Photos of policy documents are acceptable

**Land Evidence Documents:**
- Land title documents or certificates
- Land use declarations
- GPS coordinates of production plots (with maps or screenshots)
- Maps showing production areas
- Photos of land documents are acceptable
- Photos of farm plots with location markers are helpful

**General Guidelines:**
- Clear, readable photos are acceptable if original documents cannot be scanned
- Documents should be current (not expired)
- Documents should be in the cooperative's name or clearly associated with the cooperative
- If documents are in a local language, a translation may be helpful but is not always required`
      },
      {
        section_title: 'Declaration Explanations',
        section_body: `When collecting documentation, you may need to help cooperatives understand what declarations mean:

**What is a Declaration?**
A declaration is a formal statement made by the cooperative confirming certain facts or commitments. Declarations are often used when formal documents are not available or to supplement existing documentation.

**Common Declarations:**
- **Land Use Declaration**: Confirms that the land used for production is legally owned or used, and that no deforestation occurred after a specific date
- **Child Labor Declaration**: Confirms that the cooperative does not use child labor and has policies in place to prevent it
- **Origin Declaration**: Confirms the geographic origin of products and that they meet certain standards

**How to Help:**
- Explain that declarations are formal commitments, not just casual statements
- Help cooperatives understand what they are confirming
- Ensure declarations are signed by authorized representatives (e.g., cooperative president, manager)
- Date all declarations
- If a cooperative is unsure about making a declaration, help them understand what it means and what evidence supports it`
      },
      {
        section_title: 'Simple Field Checklist',
        section_body: `Use this checklist when working with cooperatives to collect documentation:

**Before Your Visit:**
- [ ] Review what documentation is needed for this cooperative
- [ ] Check if the cooperative is part of a pilot program
- [ ] Prepare a list of required document types
- [ ] Bring a camera or phone for taking photos of documents

**During Your Visit:**
- [ ] Explain why documentation is being requested
- [ ] Ask about existing documents (certifications, policies, land documents)
- [ ] Take clear photos of any documents provided
- [ ] Note the date and validity period of documents
- [ ] Ask about any missing document types
- [ ] Help cooperatives understand what acceptable alternatives might be (e.g., photos if originals unavailable)

**For Each Document Type:**
- [ ] **Certification**: Check expiration date, verify it's current
- [ ] **Policy**: Ensure it's signed and dated by authorized person
- [ ] **Land Evidence**: Verify it shows legal use, note any GPS coordinates or maps
- [ ] **Other**: Document what type it is and why it's relevant

**After Your Visit:**
- [ ] Organize photos and documents collected
- [ ] Note any gaps or missing documentation
- [ ] Record any follow-up needed
- [ ] Update documentation status in the system

**Tips:**
- Be patient and explain the purpose of documentation
- Photos are acceptable alternatives to scanned documents
- Help cooperatives understand this is about market access, not punishment
- If a cooperative doesn't have a document, help them understand what would be acceptable`
      }
    ]
  },
  {
    toolkit_id: 'coop-admin-basics',
    title: 'Cooperative Administrator Toolkit: Documentation Guide',
    audience: 'coop_admin',
    language: 'en',
    sections: [
      {
        section_title: 'Why Documentation Is Requested',
        section_body: `As a cooperative administrator, you may receive requests for documentation from buyers or field officers. Understanding why this documentation is needed can help you prepare and respond effectively.

Buyers request documentation to:
- Meet regulatory requirements (such as EUDR, child labor laws)
- Verify environmental and social practices
- Confirm legal land use and product origin
- Support their own certification and reporting needs

This documentation helps buyers make informed decisions and demonstrate compliance. Providing complete documentation can help your cooperative access more markets and build stronger buyer relationships.`
      },
      {
        section_title: 'What Documents Are Typically Needed',
        section_body: `Common document types requested include:

**Certifications:**
- Organic, Fair Trade, Rainforest Alliance, or other certifications
- Current and valid certificates
- Photos of certificates are acceptable if originals are not available

**Policies:**
- Environmental policies
- Child labor policies
- Deforestation policies
- Supplier codes of conduct
- Should be signed, dated, and on cooperative letterhead when possible

**Land Evidence:**
- Land titles or certificates
- Land use declarations
- GPS coordinates and maps of production areas
- Photos of land documents are acceptable

**Preparing Documents:**
- Keep copies of important documents in a safe place
- Note expiration dates on certifications
- Ensure policies are signed by authorized representatives
- Take photos of documents as backups`
      },
      {
        section_title: 'Understanding Declarations',
        section_body: `You may be asked to provide declarations, which are formal statements confirming certain facts.

**What Declarations Mean:**
- They are formal commitments, not casual statements
- They confirm facts about your cooperative's practices
- They should be accurate and truthful
- They are signed by authorized representatives (president, manager, etc.)

**Common Declarations:**
- **Land Use Declaration**: Confirms legal land ownership/use and no deforestation after a specific date
- **Child Labor Declaration**: Confirms no child labor and policies to prevent it
- **Origin Declaration**: Confirms geographic origin and standards compliance

**When Making Declarations:**
- Only declare what you know to be true
- If unsure, ask for clarification
- Ensure you have evidence to support your declaration
- Date and sign all declarations`
      },
      {
        section_title: 'Documentation Checklist for Administrators',
        section_body: `Use this checklist to prepare documentation for buyers:

**Certification Documents:**
- [ ] List all current certifications
- [ ] Check expiration dates
- [ ] Take photos of certificates
- [ ] Note which certifications apply to which products

**Policy Documents:**
- [ ] Review existing policies (environmental, child labor, etc.)
- [ ] Ensure policies are signed and dated
- [ ] Update policies if they are outdated
- [ ] Take photos or scans of policy documents

**Land Evidence:**
- [ ] Gather land title documents or certificates
- [ ] Prepare land use declarations if needed
- [ ] Collect GPS coordinates or maps of production areas
- [ ] Take photos of land documents

**General Preparation:**
- [ ] Organize documents by type
- [ ] Ensure documents are current (not expired)
- [ ] Take clear photos of all documents
- [ ] Keep copies in a safe location
- [ ] Be ready to explain what each document shows

**When Working with Field Officers:**
- [ ] Be prepared to show existing documents
- [ ] Ask questions if you don't understand what's needed
- [ ] Provide photos if original documents are not available
- [ ] Understand that documentation helps with market access`
      }
    ]
  }
];

