import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bluetooth, 
  Search, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Battery,
  Footprints,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const DevicePairing = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('scanning') // scanning, pairing, calibration, complete
  const [devices, setDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState({ left: null, right: null })
  const [isScanning, setIsScanning] = useState(true)
  const [calibrationStep, setCalibrationStep] = useState('standing') // standing, walking
  const [calibrationTime, setCalibrationTime] = useState(60)

  // Simulate device discovery
  useEffect(() => {
    if (currentStep === 'scanning') {
      const timer = setTimeout(() => {
        setDevices([
          { id: 'xstep-left-001', name: 'X-Step Left Insole', battery: 85, rssi: -45 },
          { id: 'xstep-right-001', name: 'X-Step Right Insole', battery: 78, rssi: -42 },
          { id: 'xstep-left-002', name: 'X-Step Left Insole', battery: 92, rssi: -65 },
          { id: 'other-device', name: 'Other BLE Device', battery: 45, rssi: -80 }
        ])
        setIsScanning(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentStep])

  // Calibration countdown
  useEffect(() => {
    if (currentStep === 'calibration' && calibrationTime > 0) {
      const timer = setTimeout(() => {
        setCalibrationTime(calibrationTime - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (calibrationTime === 0) {
      if (calibrationStep === 'standing') {
        setCalibrationStep('walking')
        setCalibrationTime(60)
      } else {
        setCurrentStep('complete')
      }
    }
  }, [calibrationTime, calibrationStep, currentStep])

  const selectDevice = (device, foot) => {
    setSelectedDevices(prev => ({ ...prev, [foot]: device }))
  }

  const startPairing = () => {
    if (selectedDevices.left && selectedDevices.right) {
      setCurrentStep('pairing')
      // Simulate pairing process
      setTimeout(() => {
        setCurrentStep('calibration')
      }, 3000)
    }
  }

  const restartScanning = () => {
    setIsScanning(true)
    setDevices([])
    setTimeout(() => {
      setDevices([
        { id: 'xstep-left-001', name: 'X-Step Left Insole', battery: 85, rssi: -45 },
        { id: 'xstep-right-001', name: 'X-Step Right Insole', battery: 78, rssi: -42 }
      ])
      setIsScanning(false)
    }, 2000)
  }

  const completeSetup = () => {
    onComplete()
  }

  const ScanningStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <motion.div
          className="inline-flex p-4 rounded-full bg-blue-100"
          animate={{ rotate: isScanning ? 360 : 0 }}
          transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
        >
          <Bluetooth className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        {isScanning ? 'Scanning for Insoles...' : 'Found Devices'}
      </h2>
      <p className="text-slate-600 mb-6">
        {isScanning 
          ? 'Make sure your insoles are powered on and nearby'
          : 'Select your left and right insoles'
        }
      </p>

      {isScanning ? (
        <div className="flex justify-center">
          <motion.div
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <motion.div
              key={device.id}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedDevices.left?.id === device.id || selectedDevices.right?.id === device.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Footprints className="w-5 h-5 text-slate-600" />
                  <div>
                    <h3 className="font-medium text-slate-800">{device.name}</h3>
                    <p className="text-sm text-slate-600">Signal: {Math.abs(device.rssi)} dBm</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-slate-600">
                    <Battery className="w-4 h-4" />
                    <span>{device.battery}%</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={selectedDevices.left?.id === device.id ? "default" : "outline"}
                      onClick={() => selectDevice(device, 'left')}
                      disabled={device.name.includes('Other')}
                    >
                      Left
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedDevices.right?.id === device.id ? "default" : "outline"}
                      onClick={() => selectDevice(device, 'right')}
                      disabled={device.name.includes('Other')}
                    >
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex space-x-3 mt-6">
            <Button variant="outline" onClick={restartScanning} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Rescan
            </Button>
            <Button 
              onClick={startPairing} 
              disabled={!selectedDevices.left || !selectedDevices.right}
              className="flex-1"
            >
              Pair Devices
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const PairingStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <motion.div
          className="inline-flex p-4 rounded-full bg-green-100"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">Pairing Devices...</h2>
      <p className="text-slate-600 mb-6">
        Establishing secure connection with your insoles
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <span className="font-medium">Left Insole</span>
          <motion.div
            className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <span className="font-medium">Right Insole</span>
          <motion.div
            className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  )

  const CalibrationStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <motion.div
          className="inline-flex p-4 rounded-full bg-orange-100"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Timer className="w-12 h-12 text-orange-600" />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">Calibration</h2>
      <p className="text-slate-600 mb-6">
        {calibrationStep === 'standing' 
          ? 'Stand still with both feet on the ground'
          : 'Walk normally around the room'
        }
      </p>

      <div className="mb-6">
        <div className="text-4xl font-bold text-orange-600 mb-2">
          {calibrationTime}
        </div>
        <div className="text-sm text-slate-600">seconds remaining</div>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
        <motion.div
          className="bg-orange-600 h-2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((60 - calibrationTime) / 60) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="text-sm text-slate-600">
        Step {calibrationStep === 'standing' ? '1' : '2'} of 2: {calibrationStep}
      </div>
    </div>
  )

  const CompleteStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <motion.div
          className="inline-flex p-4 rounded-full bg-green-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">Setup Complete!</h2>
      <p className="text-slate-600 mb-6">
        Your X-Step insoles are now connected and calibrated. You're ready to start monitoring your foot health.
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="font-medium">Left Insole</span>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="font-medium">Right Insole</span>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <Button onClick={completeSetup} className="w-full">
        Start Monitoring
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Connect Your Insoles
        </h1>
        <div className="flex justify-center space-x-2">
          {['scanning', 'pairing', 'calibration', 'complete'].map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                ['scanning', 'pairing', 'calibration', 'complete'].indexOf(currentStep) >= index 
                  ? 'bg-blue-600' 
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'scanning' && <ScanningStep />}
          {currentStep === 'pairing' && <PairingStep />}
          {currentStep === 'calibration' && <CalibrationStep />}
          {currentStep === 'complete' && <CompleteStep />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default DevicePairing

