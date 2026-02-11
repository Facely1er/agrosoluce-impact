import { Info, Shield, Users, Building2, FileText, AlertCircle } from 'lucide-react';

export default function DueCarePrinciplesPage() {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-primary-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Governance & Due-Care Principles
          </h1>
          <p className="text-gray-600">
            Framework for understanding roles, responsibilities, and limitations in the AgroSoluce platform
          </p>
        </div>

        {/* Section 1: What AgroSoluce Does */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600" />
            1. What AgroSoluce Does
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              AgroSoluce provides a platform for structuring and organizing information related to agricultural 
              cooperatives and their documentation. The platform facilitates information management and supports 
              due-diligence processes by organizing data that cooperatives and other parties provide.
            </p>
            <p>
              AgroSoluce structures information including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cooperative profile and identity information</li>
              <li>Documentation uploaded by cooperatives</li>
              <li>Documentation coverage metrics based on presence of document types</li>
              <li>Regulatory reference information for informational context</li>
              <li>Country and commodity context information</li>
            </ul>
            <p>
              The platform provides tools for organizing, viewing, and exporting this structured information. 
              It does not verify, validate, or certify the accuracy, completeness, or authenticity of information 
              provided by users.
            </p>
          </div>
        </div>

        {/* Section 2: What AgroSoluce Does Not Do */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            2. What AgroSoluce Does Not Do
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              AgroSoluce does not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verify, validate, or authenticate documents or information provided by users</li>
              <li>Make compliance determinations or certifications</li>
              <li>Assess the adequacy, sufficiency, or quality of documentation</li>
              <li>Provide legal, regulatory, or compliance advice</li>
              <li>Endorse, certify, or guarantee any cooperative, buyer, or organization</li>
              <li>Make sourcing decisions or recommendations</li>
              <li>Assume responsibility for due-diligence outcomes or decisions</li>
              <li>Guarantee the accuracy, completeness, or authenticity of information in the platform</li>
            </ul>
            <p>
              The platform structures information that users provide. It does not independently verify this 
              information or make determinations about its validity, completeness, or compliance with any 
              standards or regulations.
            </p>
          </div>
        </div>

        {/* Section 3: Farmer Protection Principles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary-600" />
            3. Farmer Protection Principles
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              AgroSoluce is designed with principles intended to protect farmer interests and reduce unnecessary 
              burden on farmers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Minimize Documentation Burden:</strong> The platform recognizes that many farmers operate 
                with limited formal documentation. It structures information that is available without requiring 
                documentation that may be inaccessible or unaffordable to farmers.
              </li>
              <li>
                <strong>Accept Diverse Evidence Types:</strong> The platform accommodates various forms of evidence, 
                including traditional documents, declarations, attestations, and contextual information, recognizing 
                that formal documentation may not be available or appropriate in all contexts.
              </li>
              <li>
                <strong>Respect Local Context:</strong> The platform provides country and commodity context information 
                to help users understand local realities, limitations, and common practices that may affect 
                documentation availability.
              </li>
              <li>
                <strong>Transparency About Limitations:</strong> The platform explicitly states limitations and 
                does not imply that documentation gaps indicate non-compliance or inadequacy.
              </li>
              <li>
                <strong>No Penalization for Documentation Gaps:</strong> The platform does not penalize or 
                disadvantage cooperatives or farmers based on documentation availability. Coverage metrics are 
                informational only and do not imply compliance status.
              </li>
            </ul>
            <p>
              These principles guide platform design but do not create legal obligations or guarantees. 
              Individual buyers and operators remain responsible for their own due-diligence decisions and 
              compliance with applicable laws and regulations.
            </p>
          </div>
        </div>

        {/* Section 4: Cooperative Role */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary-600" />
            4. Cooperative Role
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Cooperatives using the AgroSoluce platform are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Providing accurate and complete information to the best of their knowledge</li>
              <li>Uploading documents that they believe to be authentic and accurate</li>
              <li>Maintaining the accuracy of their profile and documentation over time</li>
              <li>Complying with applicable laws and regulations in their jurisdiction</li>
              <li>Understanding that the platform structures information but does not verify or certify it</li>
            </ul>
            <p>
              Cooperatives should understand that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The platform does not guarantee that information they provide will meet any buyer's requirements</li>
              <li>Buyers may have different documentation expectations and requirements</li>
              <li>Inclusion in the platform does not imply endorsement, certification, or approval</li>
              <li>They remain responsible for their own compliance with applicable laws and regulations</li>
            </ul>
            <p>
              Cooperatives are encouraged to review their information regularly and update it as needed. 
              They should also be aware that buyers may conduct their own verification and due-diligence 
              processes independent of the platform.
            </p>
          </div>
        </div>

        {/* Section 5: Buyer Responsibility */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600" />
            5. Buyer Responsibility
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Buyers using information from the AgroSoluce platform are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Conducting Independent Due Diligence:</strong> Buyers must conduct their own due-diligence 
                processes and verification of information. The platform structures information but does not verify 
                or validate it.
              </li>
              <li>
                <strong>Making Compliance Determinations:</strong> Buyers are responsible for determining whether 
                suppliers meet their compliance requirements and applicable legal obligations. The platform does not 
                make compliance determinations.
              </li>
              <li>
                <strong>Verifying Information:</strong> Buyers should verify the accuracy, completeness, and 
                authenticity of information through their own processes. The platform does not guarantee information 
                accuracy.
              </li>
              <li>
                <strong>Understanding Context:</strong> Buyers should consider country and commodity context 
                information when evaluating documentation availability and adequacy. The platform provides this 
                context for informational purposes.
              </li>
              <li>
                <strong>Making Sourcing Decisions:</strong> Buyers are solely responsible for sourcing decisions. 
                The platform does not make recommendations or assume responsibility for sourcing outcomes.
              </li>
              <li>
                <strong>Complying with Applicable Laws:</strong> Buyers must comply with all applicable laws and 
                regulations, including due-diligence obligations under regulations such as EUDR, CSDDD, and 
                national laws. The platform does not provide legal advice or compliance guidance.
              </li>
            </ul>
            <p>
              Buyers should understand that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Information in the platform is provided by cooperatives and has not been independently verified</li>
              <li>Documentation coverage metrics are informational only and do not indicate compliance status</li>
              <li>The platform does not certify, endorse, or guarantee any cooperative or supplier</li>
              <li>They may need to request additional information or documentation beyond what is in the platform</li>
              <li>They should consult with legal and compliance professionals for specific guidance</li>
            </ul>
            <p>
              Responsibility for due care and final sourcing decisions remains with buyers. The platform supports 
              information organization but does not assume responsibility for due-diligence outcomes.
            </p>
          </div>
        </div>

        {/* Section 6: Evidence Use & Limitations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-600" />
            6. Evidence Use & Limitations
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The AgroSoluce platform structures evidence and documentation for informational purposes. 
              Users should understand the following limitations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>No Verification:</strong> The platform does not verify, validate, or authenticate 
                documents or evidence. Documents are displayed as provided by users without independent verification.
              </li>
              <li>
                <strong>No Adequacy Assessment:</strong> The platform does not assess whether evidence is adequate, 
                sufficient, or appropriate for any purpose. Coverage metrics indicate document type presence, not 
                adequacy or compliance.
              </li>
              <li>
                <strong>Evidence Typology:</strong> The platform classifies evidence by type (documented, declared, 
                attested, contextual) for organizational purposes. This classification is descriptive only and does 
                not indicate quality, validity, or compliance status.
              </li>
              <li>
                <strong>Context Matters:</strong> Evidence should be evaluated in context, including country and 
                commodity context information provided in the platform. The platform provides this context for 
                informational purposes.
              </li>
              <li>
                <strong>Limitations Are Explicit:</strong> The platform explicitly states known limitations in 
                country and commodity context information. Users should consider these limitations when evaluating 
                evidence availability.
              </li>
              <li>
                <strong>No Compliance Determination:</strong> The presence or absence of evidence in the platform 
                does not indicate compliance or non-compliance with any standards, regulations, or requirements.
              </li>
            </ul>
            <p>
              Users should:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Conduct their own verification of evidence and documentation</li>
              <li>Consider context and limitations when evaluating evidence</li>
              <li>Not rely solely on platform information for compliance determinations</li>
              <li>Request additional information or documentation as needed for their purposes</li>
              <li>Consult with legal and compliance professionals for specific guidance</li>
            </ul>
            <p>
              The platform structures evidence for organizational purposes. Evaluation, verification, and compliance 
              determination remain the responsibility of users.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-2">Legal Disclaimer</p>
              <p className="mb-2">
                This document describes the governance framework and due-care principles for the AgroSoluce platform. 
                It is provided for informational purposes and does not constitute legal advice, create legal 
                obligations, or establish warranties or guarantees.
              </p>
              <p className="mb-2">
                Users of the platform are responsible for their own compliance with applicable laws and regulations, 
                including due-diligence obligations. The platform structures information but does not verify, 
                validate, or certify information or make compliance determinations.
              </p>
              <p>
                Users should consult with legal and compliance professionals for specific guidance on their 
                obligations and requirements. AgroSoluce does not assume responsibility for user decisions, 
                compliance outcomes, or due-diligence results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

