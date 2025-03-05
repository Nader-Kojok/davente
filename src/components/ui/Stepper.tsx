'use client';

type StepperProps = {
  steps: string[];
  currentStep: string;
  onStepClick?: (step: string) => void;
  completedSteps?: string[];
};

export default function Stepper({ steps, currentStep, onStepClick, completedSteps = [] }: StepperProps) {
  const handleStepClick = (step: string, index: number) => {
    if (!onStepClick) return;
    
    const currentIndex = steps.indexOf(currentStep);
    const isCompleted = completedSteps.includes(step) || index < currentIndex;
    
    if (isCompleted || index <= currentIndex + 1) {
      onStepClick(step);
    }
  };

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Step Indicators */}
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step) || index < steps.indexOf(currentStep);
            const isCurrent = currentStep === step;
            const isClickable = isCompleted || index <= steps.indexOf(currentStep) + 1;

            return (
              <div 
                key={step} 
                className="flex flex-col items-center relative z-10"
                onClick={() => handleStepClick(step, index)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 
                    ${isCompleted ? 'bg-[#E00201] text-white' : isCurrent ? 'bg-[#E00201] text-white ring-4 ring-red-100' : 'bg-gray-200 text-gray-600'}
                    ${isClickable ? 'hover:ring-2 hover:ring-red-100' : ''}`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-center w-20">
                  <span className={`${isCurrent ? 'text-[#E00201]' : isCompleted ? 'text-[#E00201]' : 'text-gray-500'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-5 left-0 transform -translate-y-1/2 h-1 bg-gray-200 w-full -z-1">
          <div
            className="h-full bg-[#E00201] transition-all duration-300"
            style={{
              width: `${(steps.indexOf(currentStep) * 20)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}