import { useState } from "react";

export default function TermsAndConditionsPage() {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Mapp My University • Last Updated: 26th March 2026
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-8">

                    <Section title="1. Introduction">
                        Welcome to <strong>Mapp My University</strong>. These Terms & Conditions govern your use of our platform. By accessing or using the platform, you agree to comply with and be bound by these terms. If you do not agree, please discontinue use immediately.
                    </Section>

                    <Section title="2. Purpose of the Platform">
                        The platform provides career guidance based on assessments such as personality, interests, and aptitude. It is designed to help users explore career options and educational pathways.
                        <p className="mt-2 text-sm text-gray-600">
                            All content is intended for informational and guidance purposes only.
                        </p>
                    </Section>

                    <Section title="3. User Eligibility">
                        By using this platform, you confirm that:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>You are at least 13 years of age</li>
                            <li>You have the legal capacity to accept these terms</li>
                            <li>The information you provide is accurate and complete</li>
                        </ul>
                    </Section>

                    <Section title="4. User Responsibilities">
                        You agree to:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide honest and accurate responses during assessments</li>
                            <li>Use the platform only for lawful purposes</li>
                            <li>Not misuse, disrupt, or attempt to gain unauthorized access</li>
                            <li>Not copy, reproduce, or distribute platform content without permission</li>
                        </ul>
                    </Section>

                    <Section title="5. Assessment & Recommendations Disclaimer">
                        The results and recommendations provided by the platform are based on your inputs and internal evaluation models.
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Results are indicative and not guaranteed</li>
                            <li>Different users may receive different outcomes</li>
                            <li>Outputs should not be considered final or definitive decisions</li>
                        </ul>
                    </Section>

                    <Section title="6. No Professional Advice">
                        The platform does not provide professional career counseling, psychological evaluation, or educational guarantees. Users are encouraged to consult qualified professionals before making important decisions.
                    </Section>

                    <Section title="7. Data Usage">
                        By using the platform, you consent that:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Your responses and results may be stored securely</li>
                            <li>Data may be used to improve platform performance</li>
                            <li>We take reasonable measures to protect your data</li>
                        </ul>
                    </Section>

                    <Section title="8. Intellectual Property">
                        The underlying platform, systems, content, algorithms, and assessment frameworks are the intellectual property of <strong>Bytrait</strong>.
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Mapp My University operates as a client-facing brand and interface</li>
                            <li>All core technology, logic, and platform content remain the property of Bytrait</li>
                            <li>Users are not granted any rights to copy, modify, or reuse platform materials</li>
                        </ul>
                    </Section>

                    <Section title="9. Branding & Representation">
                        Mapp My University operates as a client of Bytrait and is authorized to use the platform under its own branding, including name, logo, and visual identity, for user-facing presentation.

                        <p className="mt-2">
                            Such branding is solely for identification and user experience purposes and shall not be construed as ownership of the platform.
                        </p>

                        <p className="mt-2">
                            All underlying systems, software, architecture, algorithms, and content associated with the platform are and shall remain the exclusive property of <strong>Bytrait</strong>.
                        </p>

                        <p className="mt-2">
                            No rights, title, or ownership in the platform are transferred to Mapp My University or any user by virtue of usage, access, or branding.
                        </p>
                    </Section>

                    <Section title="10. Limitation of Liability">
                        Mapp My University is not responsible for:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Decisions made based on platform recommendations</li>
                            <li>Any direct or indirect loss resulting from use of the platform</li>
                            <li>Temporary interruptions or errors in service</li>
                        </ul>
                    </Section>

                    <Section title="10. Account Suspension">
                        We reserve the right to suspend or terminate access if users violate these terms or misuse the platform.
                    </Section>

                    <Section title="11. Changes to Terms">
                        These Terms & Conditions may be updated at any time. Continued use of the platform after updates implies acceptance of the revised terms.
                    </Section>

                    <Section title="12. Governing Law">
                        These terms shall be governed by the laws of India.
                    </Section>

                    <Section title="13. Contact Information">
                        For any queries, please contact us at:
                        <p className="mt-2">Email: contact@mappmyuniversity.com</p>
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {title}
            </h2>
            <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                {children}
            </div>
        </div>
    );
}
