import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { earningsData } from '../FarmerDashboard';

const FarmerAnalytics = () => {
  return (
    <div>
      <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold text-foreground">
      Sales Analytics
    </h1>

    <div className="bg-card rounded-xl border border-border p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={earningsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="aswamithra" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
    </div>
  )
}

export default FarmerAnalytics
