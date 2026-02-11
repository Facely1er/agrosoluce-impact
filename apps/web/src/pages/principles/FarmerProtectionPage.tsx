// Farmer Protection Principles Page
// Standalone page explaining AgroSoluce's approach to farmer protection

export default function FarmerProtectionPage() {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-t-4 border-primary-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Farmer Protection Principles
          </h1>
          <p className="text-lg text-gray-700">
            AgroSoluce's approach to protecting farmer privacy and reducing audit burden
          </p>
        </div>

        {/* Section 1: Our Approach to Farmer Protection */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Our Approach to Farmer Protection
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              AgroSoluce is designed to protect farmer privacy while supporting supply chain transparency. 
              Our system collects and manages documentation at the cooperative level, not at the individual 
              farmer level. This approach reduces the burden on farmers while still providing buyers with 
              the information they need for due diligence.
            </p>
            <p>
              We do not collect or store farmer names, personal identification information, or other 
              personally identifiable data. When farmer-level information is collected, it is referenced 
              using internal identifiers that cannot be used to identify individuals outside the cooperative 
              context.
            </p>
            <p>
              All farmer declarations are clearly labeled as "Self-reported / Unverified" to 
              ensure transparency about the nature of the data. We do not make verification claims or 
              compliance determinations based on farmer declarations.
            </p>
          </div>
        </div>

        {/* Section 2: What AgroSoluce Does NOT Do */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. What AgroSoluce Does NOT Do
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Scoring or Rating</h3>
              <p>
                AgroSoluce does not score, rate, or rank cooperatives or farmers. We do not create 
                compliance scores, readiness scores, or any other numerical assessments. The system 
                provides information about documentation coverage and presence, but does not make 
                judgments about quality, compliance, or readiness.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Public Exposure</h3>
              <p>
                Farmer information is never publicly exposed. Individual farmer references, declaration 
                values, and farmer-level gaps are not visible to buyers or the public. Only aggregate 
                information at the cooperative level is made available to buyers, and only for cooperatives 
                that have been made visible to buyers by the cooperative.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Penalties or Consequences</h3>
              <p>
                AgroSoluce does not impose penalties, sanctions, or negative consequences based on 
                documentation status or declaration content. Missing documentation or incomplete 
                declarations do not result in restrictions, exclusions, or negative outcomes. The system 
                is informational only.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No Automatic Decisions</h3>
              <p>
                The system does not make automatic decisions about compliance, eligibility, or suitability. 
                All assessments and decisions remain with buyers, who make their own determinations based 
                on their specific requirements and standards.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: How Data is Used and Reused */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. How Data is Used and Reused to Reduce Audit Burden
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              One of AgroSoluce's core principles is reducing the audit burden on cooperatives and farmers. 
              When documentation is collected and stored in the system, it can be reused across multiple 
              buyer requests and audit processes, rather than requiring new documentation for each buyer or 
              audit.
            </p>
            <p>
              Documentation uploaded to the system remains available for future use, reducing the need for 
              cooperatives to repeatedly provide the same documents to different buyers. This approach 
              minimizes the time and effort required from farmers and cooperative staff.
            </p>
            <p>
              The system tracks documentation coverage and presence, allowing cooperatives to understand 
              what documentation they have available without needing to manually track this information 
              for each buyer interaction. This reduces administrative overhead and allows cooperatives to 
              focus on their core operations.
            </p>
            <p>
              Buyers can access documentation that cooperatives have already provided, reducing the need 
              for redundant requests and multiple rounds of documentation collection. This efficiency 
              benefit applies to all parties while maintaining farmer privacy protections.
            </p>
          </div>
        </div>

        {/* Section 4: Responsibilities */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Responsibilities of Buyers, Cooperatives, and Operators
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Buyers</h3>
              <p>
                Buyers are responsible for making their own assessments and decisions based on the 
                information available in the system. Buyers must understand that the system provides 
                informational support only and does not make compliance determinations. Buyers are 
                responsible for verifying information as needed for their own due diligence processes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cooperatives</h3>
              <p>
                Cooperatives are responsible for accurately representing their documentation status and 
                providing truthful information. Cooperatives are responsible for managing access to their 
                information and ensuring that only authorized personnel can upload or modify documentation. 
                Cooperatives must understand that the system is informational and does not replace their 
                own compliance obligations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Operators</h3>
              <p>
                System operators are responsible for maintaining the technical infrastructure and ensuring 
                that privacy protections are enforced. Operators do not verify, validate, or make 
                determinations about the content of documentation or declarations. Operators maintain the 
                system's informational nature and do not impose judgments or consequences based on system 
                data.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mt-8">
          <p className="text-sm text-gray-600 text-center">
            This document outlines AgroSoluce's principles and approach. It does not constitute legal 
            advice or create contractual obligations. For specific questions about implementation or 
            compliance, consult appropriate legal or compliance professionals.
          </p>
        </div>
      </div>
    </div>
  );
}

