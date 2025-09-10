import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Footprints, 
  AlertTriangle, 
  TrendingUp, 
  Settings 
} from 'lucide-react'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/footmap', icon: Footprints, label: 'Foot Map' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#2563eb' : '#64748b'
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={24} />
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {label}
              </span>
              
              {isActive && (
                <motion.div
                  className="absolute -top-0.5 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  layoutId="activeIndicator"
                  style={{ x: '-50%' }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}

export default Navigation

