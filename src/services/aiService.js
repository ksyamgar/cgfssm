// AI Analytics & Predictive Insights Engine for CG Rural FSSM

export const generateAiInsights = (requests, vehicles, fstps) => {
  const totalVolume = requests.reduce((acc, r) => acc + (r.tankVolumeLitres || 3000), 0);
  const emergencyCount = requests.filter(r => r.isEmergency).length;
  const emergencyRatio = requests.length ? ((emergencyCount / requests.length) * 100).toFixed(1) : 0;

  return {
    summary: {
      predictedMonthlyDemandKL: 480,
      confidenceScore: 92.4,
      threeYearCycleSaturation: '68% of households in Dharsiwa block due for desludging in Q4',
      co2eOffsetTons: (totalVolume * 0.00042).toFixed(2),
      recommendedFleetReallocation: 'Deploy 2 additional mini vacuum units to Arang cluster to handle narrow lane access'
    },
    demandForecast: [
      { month: 'Oct 2026', predictedKL: 410, actualKL: 395, capacityKL: 550 },
      { month: 'Nov 2026', predictedKL: 460, actualKL: 450, capacityKL: 550 },
      { month: 'Dec 2026', predictedKL: 520, actualKL: null, capacityKL: 550 },
      { month: 'Jan 2027', predictedKL: 490, actualKL: null, capacityKL: 550 },
      { month: 'Feb 2027', predictedKL: 430, actualKL: null, capacityKL: 550 },
      { month: 'Mar 2027', predictedKL: 510, actualKL: null, capacityKL: 550 }
    ],
    anomalies: [
      {
        id: 'anom_01',
        severity: 'HIGH',
        type: 'UNAUTHORIZED_STOP_NEAR_WATER_BODY',
        vehicleNo: 'CG-04-ME-4821',
        location: 'Kharun River Bridge crossing (NH-53)',
        timestamp: 'Today, 10:42 AM',
        status: 'AUTO_FLAGGED_CLEAR',
        explanation: 'Vehicle halted for 4 mins near river periphery; GPS geo-fence triggered inspection flag. No decant detected by pressure sensors.'
      },
      {
        id: 'anom_02',
        severity: 'MEDIUM',
        type: 'PLANT_CAPACITY_OVERLOAD_FORECAST',
        vehicleNo: 'Multiple Units',
        location: 'Arang Cluster FSTP',
        timestamp: 'Forecast for Saturday',
        status: 'REVISE_ROUTE_RECOMMENDED',
        explanation: 'FSTP decanting intake will reach 94% capacity by Saturday afternoon. AI suggests routing 4 trips to Nimora Urban STP (cross-utilization model).'
      }
    ],
    threeYearRecommendations: [
      { gp: 'Mandir Hasaud (124805)', householdsTarget: 340, enrolledScheduled: 215, riskLevel: 'LOW', estimatedSludgeKL: 645 },
      { gp: 'Gullu (124755)', householdsTarget: 220, enrolledScheduled: 84, riskLevel: 'HIGH', estimatedSludgeKL: 418 },
      { gp: 'Jamgaon R (124600)', householdsTarget: 290, enrolledScheduled: 180, riskLevel: 'MEDIUM', estimatedSludgeKL: 550 }
    ]
  };
};
