// VoltGuard - Tactical Crew Pre-Positioning & Staging Dossiers Dataset

export const CREW_STAGING_DATA = [
  {
    id: 'crew-alpha',
    name: 'Alpha Heavy Response Unit',
    specialty: 'Substation Integrity Specialists',
    headcount: 6,
    status: 'In Transit',
    etaMinutes: 42,
    targetYard: 'Staging Yard Bravo (Pine Valley Lowland Corridor)',
    assignedAsset: 'Pine Valley T-1 (500kV XFMR)',
    assetId: 'xfmr-pv-500-1',
    equipment: 'Mobile 100MVA Degasser System - Oil Filtration Rig - SF6 High-Vacuum Evacuator',
    radioChannel: 'UHF-TAC-14',
    coordinates: { lat: 29.771, lng: -95.412 },
    safetyStatus: 'En-route prior to 45mph sustained wind arrival (Safety buffer 2.5h)',
    workOrdersCount: 2,
    checklist: [
      { task: 'Pre-inspect mobile degasser diesel fuel reserves', done: true },
      { task: 'Verify GIS SF6 cylinder top-off pressures', done: true },
      { task: 'Verify LOTO clearance with EOC Dispatch', done: false },
      { task: 'Establish local acoustic and DGA probe telemetry connection', done: false }
    ]
  },
  {
    id: 'crew-bravo',
    name: 'Bravo Transmission Strike Team',
    specialty: 'Bucket Trucks & Arborist Line Clearance',
    headcount: 8,
    status: 'On Site / Staged',
    etaMinutes: 0,
    targetYard: 'Corridor Mile Marker 34 (Tower 114)',
    assignedAsset: 'Feeder T14 Galloping Span 48',
    assetId: 'feeder-t14',
    equipment: '3x 75-ft Insulated Bucket Trucks - FLIR Thermal Drone - Conductor Inter-phase Spacers',
    radioChannel: 'VHF-GRID-02',
    coordinates: { lat: 29.895, lng: -95.221 },
    safetyStatus: 'Safety Anchor Verified (Clear of 100-yr flood inundation plain)',
    workOrdersCount: 1,
    checklist: [
      { task: 'Drone thermal scan of galloping conductor clamps', done: true },
      { task: 'Rig inter-phase aerodynamic dampers', done: true },
      { task: 'Perform bucket arm retraction before gusts exceed 45 mph', done: true },
      { task: 'Complete ground arborist tree-limb clearance buffer', done: true }
    ]
  },
  {
    id: 'crew-delta',
    name: 'Delta Emergency Power & Hydro',
    specialty: 'Flood Mitigation & Aux Power Unit',
    headcount: 4,
    status: 'Dispatched',
    etaMinutes: 15,
    targetYard: 'Substation 18 Lowland Basins',
    assignedAsset: 'Substation 18 Pumping Yard & Sump Well',
    assetId: 'sub42-xfmr-500-02',
    equipment: '3x 5,000 GPM High-Volume Submersible Dewatering Pumps - 500kW Trailered Generator',
    radioChannel: 'UHF-TAC-09',
    coordinates: { lat: 29.838, lng: -95.328 },
    safetyStatus: 'Pre-emptive sump clearing scheduled (ETA 15m to crest arrival)',
    workOrdersCount: 2,
    checklist: [
      { task: 'Hook up trailer auxiliary backup power to substation 125V DC bus', done: true },
      { task: 'Deploy Aqua-Barrier flood bladder along perimeter berm', done: false },
      { task: 'Test automatic float switch ignition on emergency pump #3', done: false }
    ]
  },
  {
    id: 'crew-gamma',
    name: 'Gamma Protection & Relaying Unit',
    specialty: 'Microprocessor Relay & SCADA Specialists',
    headcount: 3,
    status: 'On Site / Staged',
    etaMinutes: 0,
    targetYard: 'Westside Metro Regional Yard',
    assignedAsset: 'Westside Metro Sub Bus B',
    assetId: 'westside-bus-b',
    equipment: 'SEL Relay Test Set - Optical Time Domain Reflectometer (OTDR) - SCADA Gateway Node',
    radioChannel: 'VHF-GRID-05',
    coordinates: { lat: 29.748, lng: -95.485 },
    safetyStatus: 'Indoor control house operational (Safe from gale wind vectors)',
    workOrdersCount: 1,
    checklist: [
      { task: 'Arm pre-programmed bus differential protection bypass logic', done: true },
      { task: 'Synchronize fiber-optic sync pulses with EOC', done: true },
      { task: 'Verify DC battery bank float voltage', done: true }
    ]
  }
];

export const STAGING_METRICS = {
  interruptionAvoidanceDollars: 11400000,
  restorationReductionPercent: 68,
  restorationReductionHours: 5.4,
  crewSafetyBufferHours: 2.5,
  criticalFleetPositioned: '8 of 8 Specialized Units',
  safetyCutoffCompliance: '98.7% Safety Index (Zero bucket work in >45mph)',
  operationsReady: 4
};
