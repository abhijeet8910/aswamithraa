import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { procurementData } from '../B2BDashboard';

const Analytics = () => {
  return (
    <div>
       <div className="space-y-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        Procurement Analytics
      </h1>
      <p className="text-muted-foreground text-sm">
        Monthly spend overview
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={procurementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="spend" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
    </div>
  )
}

export default Analytics
