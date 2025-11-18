import React from 'react'

function OnboardingMessage() {
  return (
    <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
                <span className="text-cyan-600">Welcome,</span>{" "}
                <span className="text-black">Examinee!</span>
              </h1>
              <div className="space-y-4 lg:space-y-6 text-gray-800 text-sm sm:text-base">
                <p className="leading-relaxed">
                  Thank you for your interest in joining our program. Please
                  complete the form with accurate information
                  <span className="font-semibold">
                    {" "}
                    — especially your email address, as it will be used to link
                    your account and test results.
                  </span>
                </p>
                <p className="leading-relaxed">
                  Once you've submitted your details, you'll receive access to
                  your assessment. Make sure to take the test only once per
                  applicant.
                </p>
                <p className="leading-relaxed">
                  <span className="text-cyan-600 font-bold">Good luck</span>{" "}
                  <span className="font-semibold">—</span> we're excited to see
                  how you perform!
                </p>
              </div>
            </div>
  )
}

export default OnboardingMessage