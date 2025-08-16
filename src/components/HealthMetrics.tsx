'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Moon, TrendingUp, Plus, Smartphone, Upload, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../contexts/HealthDataContext'

export const HealthMetrics = () => {
  const { 
    healthMetrics, 
    addHealthMetric, 
    syncWithWearable, 
    exportHealthData, 
    isLoading 
  } = useHealthData()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [formData, setFormData] = useState({
    type: 'sleep' as const,
    value: '',
    unit: 'hours'
  })

  const metricTypes = [
    { value: 'sleep', label: 'Sleep', icon: Moon, color: 'purple', unit: 'hours' },
    { value: 'steps', label: 'Steps', icon: Activity, color: 'green', unit: 'steps' },
    { value: 'heart_rate', label: 'Heart Rate', icon: Heart, color: 'red', unit: 'bpm' },
    { value: 'blood_pressure', label: 'Blood Pressure', icon: TrendingUp, color: 'orange', unit: 'mmHg' },
    { value: 'weight', label: 'Weight', icon: TrendingUp, color: 'blue', unit: 'lbs' },
  ]

  const filteredMetrics = selectedMetric === 'all' 
    ? healthMetrics 
    : healthMetrics.filter(m => m.type === selectedMetric)

  // Prepare chart data
  const chartData = filteredMetrics
    .slice(-30) // Last 30 readings
    .map(metric => ({
      date: metric.timestamp.toLocaleDateString(),
      value: metric.value,
      type: metric.type
    }))

  const getMetricSummary = (type: string) => {
    const typeMetrics = healthMetrics.filter(m => m.type === type)
    if (typeMetrics.length === 0) return null

    const latest = typeMetrics[0]
    const average = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length
    const trend = typeMetrics.length > 1 ? 
      (latest.value > typeMetrics[1].value ? 'up' : 'down') : 'stable'

    return { latest, average, trend }
  }

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.value) return

    addHealthMetric({
      type: formData.type,
      value: parseFloat(formData.value),
      unit: formData.unit
    })

    setFormData({ type: 'sleep', value: '', unit: 'hours' })
    setShowAddForm(false)
  }

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const blob = await exportHealthData(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `health-data.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Metrics</h2>
            <p className="text-gray-600 mt-1">Track and monitor your health data over time</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={syncWithWearable}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isLoading ? 'Syncing...' : 'Sync Wearable'}</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricTypes.map((type) => {
          const summary = getMetricSummary(type.value)
          const Icon = type.icon
          
          return (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all ${
                selectedMetric === type.value ? `ring-2 ring-${type.color}-500` : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedMetric(selectedMetric === type.value ? 'all' : type.value)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 text-${type.color}-500`} />
                {summary?.trend && (
                  <TrendingUp className={`w-4 h-4 ${
                    summary.trend === 'up' ? 'text-green-500' : 
                    summary.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-1">{type.label}</h3>
              
              {summary ? (
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.latest.value} <span className="text-sm text-gray-500">{type.unit}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg: {summary.average.toFixed(1)} {type.unit}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No data</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedMetric === 'all' ? 'All Metrics' : 
             metricTypes.find(t => t.value === selectedMetric)?.label} Trend
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center space-x-2 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data to display</p>
              <p className="text-sm">Add some health metrics to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Metrics List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Readings</h3>
        
        <div className="space-y-3">
          {filteredMetrics.slice(0, 10).map((metric) => {
            const type = metricTypes.find(t => t.value === metric.type)
            const Icon = type?.icon || Activity
            
            return (
              <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${type?.color}-100`}>
                    <Icon className={`w-4 h-4 text-${type?.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{type?.label}</p>
                    <p className="text-sm text-gray-500">
                      {metric.timestamp.toLocaleDateString()} at {metric.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {metric.value} {metric.unit}
                  </p>
                  {metric.verified && (
                    <p className="text-xs text-green-600">✓ Verified</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {filteredMetrics.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No health metrics recorded yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Add your first metric
            </button>
          </div>
        )}
      </div>

      {/* Add Metric Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Health Metric</h3>
            
            <form onSubmit={handleAddMetric} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const type = e.target.value as any
                    const metricType = metricTypes.find(t => t.value === type)
                    setFormData(prev => ({ 
                      ...prev, 
                      type, 
                      unit: metricType?.unit || 'units' 
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {metricTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter value"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Metric
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}