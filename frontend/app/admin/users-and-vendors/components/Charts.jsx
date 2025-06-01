import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Charts = ({ userChartData, vendorChartData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Users Chart */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">User Distribution</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#0088FE" name="Users">
                                {userChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Vendors Chart */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm col-span-2">
                <h3 className="font-semibold mb-4">Vendor Verification Status</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vendorChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" textAnchor="middle" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip formatter={(value, name) => {
                                const fullName = {
                                    'Total': 'Total Vendors',
                                    'Verified': 'Verified Vendors',
                                    'New': 'New Chefs',
                                    'Unverified': 'Unverified Vendors',
                                };
                                return [value, fullName[name] || name];
                            }} />
                            <Legend />
                            <Bar dataKey="value" name="Vendors">
                                {vendorChartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={
                                            entry.name === 'Total' ? '#EC4899' :
                                            entry.name === 'Verified' ? '#22C55E' :
                                            entry.name === 'Unverified' ? '#f0e811' :
                                            entry.name === 'New' ? '#6B7280' :
                                            COLORS[index % COLORS.length]
                                        } 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts; 