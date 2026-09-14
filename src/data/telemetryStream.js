// GridPulse AI - Live SCADA Telemetry Stream Simulator

export const INITIAL_STREAM_EVENTS = [
  {
    id: 'evt-1',
    time: '14:02:18',
    severity: 'CRIT',
    source: 'Pine Valley T1: DGA C2H2 rate-of-rise alert',
    detail: '+14 ppm/hr increase. Inter-turn arcing verified on Phase B winding. Winding hotspot: 135.4°C.'
  },
  {
    id: 'evt-2',
    time: '14:01:52',
    severity: 'WARN',
    source: 'NWS Doppler: Peak gust registered 82 mph',
    detail: 'Approaching Line 502 Transmission Corridor. Conductor galloping advisory in effect.'
  },
  {
    id: 'evt-3',
    time: '14:00:33',
    severity: 'WARN',
    source: 'Red Bluff BKR-230: SF6 pressure step delta',
    detail: 'Gas pressure dropped from 31 to 28 PSI over 15 mins. Lock-out recommendation issued.'
  },
  {
    id: 'evt-4',
    time: '13:58:10',
    severity: 'INFO',
    source: 'EOC Staging: Alpha Heavy Response Unit en-route',
    detail: 'ETA 42m to Pine Valley Substation Yard 4. UHF radio link synchronized.'
  },
  {
    id: 'evt-5',
    time: '13:55:45',
    severity: 'CRIT',
    source: 'Coastal Substation 9: Sump pump #1 trip',
    detail: 'Basement well sensor high saturated (+10.4 in). Control house DC battery backup threatened.'
  },
  {
    id: 'evt-6',
    time: '13:52:14',
    severity: 'INFO',
    source: 'NERC Regional ERCOT/SPP Gateway sync',
    detail: 'SCADA polling rate: 400ms. All 42 telemetry channels locked and validated under CIP-007.'
  }
];

export const DYNAMIC_EVENT_POOL = [
  {
    severity: 'WARN',
    source: 'Trans-Texas Feeder T14: Aero-elastic Gallop detected',
    detail: 'Span 48 oscillation amplitude 2.6m. Dynamic line rating de-rated to 380 MVA.'
  },
  {
    severity: 'CRIT',
    source: 'Substation 42: Partial discharge PRPD spike',
    detail: 'Peak 6,800 pC recorded. Acoustic sensor triangulated to Tank Core Zone B-Upper.'
  },
  {
    severity: 'INFO',
    source: 'Mobile Substation 4: Engine start confirmed',
    detail: 'Staging unit pre-deployed toward Oakridge 500kV bypass tie point.'
  },
  {
    severity: 'WARN',
    source: 'Highland Ridge Bushing B: C1 Capacitance drift',
    detail: '+6.8% tap drift detected under rapid ambient wind chill. Thermal delta +14.2°C.'
  },
  {
    severity: 'INFO',
    source: 'Bravo Strike Team: Conductor drone survey complete',
    detail: 'Arborist clearance confirmed. Bucket trucks retracted prior to 45 mph gust window.'
  }
];
