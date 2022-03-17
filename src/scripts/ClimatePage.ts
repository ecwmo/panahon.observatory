const imgDir = 'resources/climate/img/'

const climateVariables = [
  { varName: 'tmean', desc: 'Daily Average Temperature' },
  { varName: 'tmin', desc: 'Daily Minimum Temperature' },
  { varName: 'tmax', desc: 'Daily Maximum Temperature' },
  { varName: 'precip', desc: 'Daily Rainfall' },
]

const climateScenarios = ['RCP45', 'RCP85']

const decades = [
  [2020, 2029],
  [2030, 2039],
  [2040, 2049],
  [2050, 2059],
  [2060, 2069],
  [2070, 2079],
  [2080, 2089],
  [2090, 2099],
]

const climateSelect = () => ({
  climateVariables,
  climateScenarios,
  decades,
  activeScenario: 'RCP45',
  activeVariable: 'tmean',
  activeDecade: 2020,
  get imgName() {
    const [sYear, eYear] = decades.find((d) => d[0] === this.activeDecade) || [0, 0]
    return `${imgDir}/ens_${this.activeScenario}_${this.activeVariable}_${sYear}-${eYear}_anomaly_timmean.png`
  },
  get minDecade() {
    const vals = this.decades.map((v) => v[0])
    return Math.min(...vals)
  },
  get maxDecade() {
    const vals = this.decades.map((v) => v[0])
    return Math.max(...vals)
  },
})

export { climateSelect }
