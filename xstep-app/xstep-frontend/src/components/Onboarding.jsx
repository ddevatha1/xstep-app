import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Footprints, 
  Shield, 
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('english')

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to X-Step',
      subtitle: 'Smart Insole Health Monitoring',
      description: 'X-Step helps diabetic patients monitor foot health through smart insole technology, detecting early signs of foot ulcers.',
      icon: Heart,
      color: 'text-blue-600'
    },
    {
      id: 'language',
      title: 'Choose Your Language',
      subtitle: 'Select your preferred language',
      description: 'X-Step supports multiple languages to make health monitoring accessible to everyone.',
      icon: Globe,
      color: 'text-green-600'
    },
    {
      id: 'features',
      title: 'Key Features',
      subtitle: 'What X-Step can do for you',
      description: 'Real-time foot pressure monitoring, temperature tracking, risk alerts, and trend analysis.',
      icon: Footprints,
      color: 'text-orange-600'
    },
    {
      id: 'privacy',
      title: 'Your Privacy Matters',
      subtitle: 'Secure and private health data',
      description: 'All your health data is encrypted and stored securely. You control who has access to your information.',
      icon: Shield,
      color: 'text-purple-600'
    }
  ]

  const currentStepData = steps[currentStep]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const LanguageSelector = () => (
    <div className="space-y-3">
      {[
        { key: 'english', label: 'English', flag: '🇺🇸' },
        { key: 'spanish', label: 'Español', flag: '🇪🇸' }
      ].map(({ key, label, flag }) => (
        <motion.button
          key={key}
          className={`w-full p-4 rounded-xl border-2 transition-colors ${
            selectedLanguage === key 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          onClick={() => setSelectedLanguage(key)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{flag}</span>
            <span className="font-medium text-slate-800">{label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )

  const FeaturesList = () => (
    <div className="space-y-4">
      {[
        { icon: '📊', title: 'Real-time Monitoring', desc: 'Live foot pressure and temperature tracking' },
        { icon: '⚠️', title: 'Smart Alerts', desc: 'Immediate notifications for risk conditions' },
        { icon: '📈', title: 'Trend Analysis', desc: 'Historical data and progress tracking' },
        { icon: '👥', title: 'Care Team Sharing', desc: 'Share reports with healthcare providers' }
      ].map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="text-2xl">{feature.icon}</span>
          <div>
            <h4 className="font-semibold text-slate-800">{feature.title}</h4>
            <p className="text-sm text-slate-600">{feature.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 max-w-md mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-slate-600">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Icon */}
          <div className="text-center mb-6">
            <div className={`inline-flex p-4 rounded-full bg-white shadow-lg ${currentStepData.color}`}>
              <currentStepData.icon size={48} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {currentStepData.title}
            </h1>
            <h2 className="text-lg text-slate-600 mb-4">
              {currentStepData.subtitle}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific content */}
          <div className="mb-8">
            {currentStepData.id === 'language' && <LanguageSelector />}
            {currentStepData.id === 'features' && <FeaturesList />}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-1"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </Button>

        <Button
          onClick={nextStep}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
        >
          <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Skip option */}
      {currentStep < steps.length - 1 && (
        <div className="text-center mt-4">
          <button
            onClick={onComplete}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Skip tutorial
          </button>
        </div>
      )}
    </div>
  )
}

export default Onboarding

