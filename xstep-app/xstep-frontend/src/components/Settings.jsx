import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Battery, 
  Shield, 
  Users, 
  Bluetooth, 
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Settings = () => {
  const [language, setLanguage] = useState('english')
  const [samplingMode, setSamplingMode] = useState('normal')
  const [dataSync, setDataSync] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoAlerts, setAutoAlerts] = useState(true)

  const SettingItem = ({ icon: Icon, title, subtitle, children, onClick }) => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-4"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {children}
          {onClick && <ChevronRight className="w-5 h-5 text-slate-400" />}
        </div>
      </div>
    </motion.div>
  )

  const Toggle = ({ enabled, onChange }) => (
    <button onClick={onChange} className="focus:outline-none">
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-blue-600" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-slate-400" />
      )}
    </button>
  )

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Configure your X-Step experience</p>
      </motion.div>

      {/* Device Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Device Settings</h2>
        
        <SettingItem
          icon={Bluetooth}
          title="Reconnect Insoles"
          subtitle="Scan and pair with smart insoles"
          onClick={() => {/* Handle reconnection */}}
        />

        <SettingItem
          icon={Battery}
          title="Sampling Mode"
          subtitle={`Current: ${samplingMode.charAt(0).toUpperCase() + samplingMode.slice(1)}`}
        >
          <select 
            value={samplingMode}
            onChange={(e) => setSamplingMode(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="battery">Battery Saver</option>
            <option value="normal">Normal</option>
            <option value="high">High Accuracy</option>
          </select>
        </SettingItem>
      </motion.div>

      {/* App Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-6">App Settings</h2>
        
        <SettingItem
          icon={Globe}
          title="Language"
          subtitle={`Current: ${language.charAt(0).toUpperCase() + language.slice(1)}`}
        >
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="english">English</option>
            <option value="spanish">Español</option>
          </select>
        </SettingItem>

        <SettingItem
          icon={Bell}
          title="Notifications"
          subtitle="Receive risk alerts and reminders"
        >
          <Toggle 
            enabled={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </SettingItem>

        <SettingItem
          icon={Shield}
          title="Data Sync"
          subtitle="Sync data to cloud for backup"
        >
          <Toggle 
            enabled={dataSync}
            onChange={() => setDataSync(!dataSync)}
          />
        </SettingItem>
      </motion.div>

      {/* Care Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-6">Care Team</h2>
        
        <SettingItem
          icon={Users}
          title="Caregiver Contacts"
          subtitle="Manage emergency contacts"
          onClick={() => {/* Handle caregiver management */}}
        />

        <SettingItem
          icon={Bell}
          title="Auto Alerts"
          subtitle="Send alerts to caregivers automatically"
        >
          <Toggle 
            enabled={autoAlerts}
            onChange={() => setAutoAlerts(!autoAlerts)}
          />
        </SettingItem>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-6">Support</h2>
        
        <SettingItem
          icon={HelpCircle}
          title="Help & FAQ"
          subtitle="Get help with using X-Step"
          onClick={() => {/* Handle help */}}
        />

        <SettingItem
          icon={Info}
          title="About X-Step"
          subtitle="Version 1.0.0"
          onClick={() => {/* Handle about */}}
        />
      </motion.div>

      {/* Reset Options */}
      <motion.div
        className="mt-8 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            localStorage.removeItem('xstep-device-paired')
            window.location.reload()
          }}
        >
          Reset Device Pairing
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => {
            if (confirm('This will clear all data. Are you sure?')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
        >
          Reset All Data
        </Button>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        className="mt-6 p-4 bg-blue-50 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-sm text-blue-800">
          <Shield className="w-4 h-4 inline mr-1" />
          Your health data is encrypted and stored securely. We never share personal information without your consent.
        </p>
      </motion.div>
    </div>
  )
}

export default Settings

