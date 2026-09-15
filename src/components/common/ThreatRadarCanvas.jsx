import React, { useRef, useEffect, useState } from 'react';

export default function ThreatRadarCanvas({
  activeTimeStep = 'NOW',
  onSelectAsset,
  selectedAssetId = null
}) {
  const canvasRef = useRef(null);
  const [layers, setLayers] = useState({
    radarFront: true,
    bulkLines: true,
    alarms: true,
    crews: true
  });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Substation nodes on radar coordinates (x, y mapped to 0..500 canvas coordinate space)
  const nodes = [
    {
      id: 'cedar-creek',
      name: 'Cedar Creek T-1',
      type: 'Autotransformer',
      x: 235,
      y: 195,
      kv: '500kV',
      prob: 88.4,
      mw: 450,
      customers: '240,000',
      critical: true
    },
    {
      id: 'xfmr-pv-500-1',
      name: 'Pine Valley T-1',
      type: 'Autotransformer 500kV',
      x: 155,
      y: 220,
      kv: '500kV',
      prob: 94.2,
      mw: 492,
      customers: '350,000',
      critical: true
    },
    {
      id: 'red-bluff-bkr-230',
      name: 'Red Bluff BKR-230',
      type: 'SF6 Breaker',
      x: 340,
      y: 260,
      kv: '230kV',
      prob: 86.1,
      mw: 320,
      customers: '190,000',
      critical: true
    },
    {
      id: 'westside-bus-b',
      name: 'Westside Metro',
      type: 'Bus Section B',
      x: 180,
      y: 310,
      kv: '230kV',
      prob: 88.1,
      mw: 388,
      customers: '240,000',
      critical: true
    },
    {
      id: 'feeder-t14',
      name: 'Spring Branch / Feeder T14',
      type: 'Double Circuit',
      x: 290,
      y: 140,
      kv: '345kV',
      prob: 84.5,
      mw: 480,
      customers: '160,000',
      critical: true
    },
    {
      id: 'harbor-point-gis',
      name: 'Harbor Point GIS',
      type: '230kV GIS',
      x: 380,
      y: 330,
      kv: '230kV',
      prob: 76.2,
      mw: 260,
      customers: '95,000',
      critical: false
    }
  ];

  // Radar sweep animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let sweepAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Clear
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, w, h);

      // Range Rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let r = 50; r <= 220; r += 50) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, 10);
      ctx.lineTo(cx, h - 10);
      ctx.moveTo(10, cy);
      ctx.lineTo(w - 10, cy);
      ctx.stroke();

      // Radar Front Cloud Overlay (offset based on activeTimeStep)
      if (layers.radarFront) {
        let stormOffset = 0;
        if (activeTimeStep === '+2h') stormOffset = 40;
        if (activeTimeStep === '+6h') stormOffset = 90;
        if (activeTimeStep === '+12h') stormOffset = 150;
        if (activeTimeStep === '+24h') stormOffset = 210;
        if (activeTimeStep === '+48h') stormOffset = 280;

        // Front gradient wave
        const frontGrad = ctx.createLinearGradient(0, 50 + stormOffset, 300, 350 + stormOffset);
        frontGrad.addColorStop(0, 'rgba(225, 29, 72, 0.35)');
        frontGrad.addColorStop(0.4, 'rgba(234, 88, 12, 0.28)');
        frontGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.18)');
        frontGrad.addColorStop(1, 'rgba(56, 189, 248, 0.03)');

        ctx.fillStyle = frontGrad;
        ctx.beginPath();
        ctx.moveTo(30 + stormOffset * 0.4, 20);
        ctx.bezierCurveTo(180 + stormOffset * 0.5, 90, 260 + stormOffset * 0.6, 210, 380 + stormOffset * 0.7, 360);
        ctx.lineTo(490, 490);
        ctx.lineTo(10, 490);
        ctx.closePath();
        ctx.fill();

        // Convective storm contour core
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(60 + stormOffset * 0.4, 40);
        ctx.bezierCurveTo(200 + stormOffset * 0.5, 120, 290 + stormOffset * 0.6, 240, 410 + stormOffset * 0.7, 380);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 500kV Bulk Transmission Lines
      if (layers.bulkLines) {
        // Line 502 (Pine Valley to Cedar Creek to Red Bluff)
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.stroke();

        // 230kV Feeder ring (Pine Valley to Westside Metro to Harbor Point)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[5].x, nodes[5].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.stroke();

        // High Voltage Corridor Labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '9px Inter';
        ctx.fillText('Line 502 (500kV Bulk)', 175, 180);
        ctx.fillText('230kV Feeder Tie', 215, 335);
      }

      // Draw Rotating Radar Beam
      const beamGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 220, sweepAngle, sweepAngle + 0.35);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // Draw Substation Nodes
      nodes.forEach((node) => {
        const isSelected = selectedAssetId === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Threat Risk Halo
        if (layers.alarms && node.critical) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 14 + Math.sin(Date.now() / 250) * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(225, 29, 72, 0.18)';
          ctx.fill();
        }

        // Outer Ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected || isHovered ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = node.prob > 90 ? '#e11d48' : node.prob > 80 ? '#ea580c' : '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = isSelected ? '#38bdf8' : '#f8fafc';
        ctx.font = '10px Inter';
        ctx.fontWeight = '600';
        ctx.fillText(node.name, node.x + 10, node.y - 4);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`${node.prob}% POF | ${node.mw}MW`, node.x + 10, node.y + 7);
      });

      // Advance sweep angle
      sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [layers, activeTimeStep, selectedAssetId, hoveredNode]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 400;

    const hit = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 20);
    if (hit && onSelectAsset) {
      onSelectAsset(hit.id);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 400;
    const hit = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 20);
    setHoveredNode(hit || null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Top Toolbar overlay */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        display: 'flex',
        gap: 6,
        zIndex: 10
      }}>
        <button
          onClick={() => setLayers(p => ({ ...p, radarFront: !p.radarFront }))}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            fontWeight: 600,
            borderRadius: 3,
            border: '1px solid',
            borderColor: layers.radarFront ? '#0284c7' : '#334155',
            background: layers.radarFront ? '#0284c7' : 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Radar Front
        </button>
        <button
          onClick={() => setLayers(p => ({ ...p, bulkLines: !p.bulkLines }))}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            fontWeight: 600,
            borderRadius: 3,
            border: '1px solid',
            borderColor: layers.bulkLines ? '#2563eb' : '#334155',
            background: layers.bulkLines ? '#2563eb' : 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          500kV Lines
        </button>
        <button
          onClick={() => setLayers(p => ({ ...p, alarms: !p.alarms }))}
          style={{
            padding: '3px 8px',
            fontSize: '0.7rem',
            fontWeight: 600,
            borderRadius: 3,
            border: '1px solid',
            borderColor: layers.alarms ? '#e11d48' : '#334155',
            background: layers.alarms ? '#e11d48' : 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Alarms
        </button>
      </div>

      {/* Projection details badge */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid #1e293b',
        padding: '3px 8px',
        borderRadius: 3,
        fontSize: '0.65rem',
        color: '#94a3b8',
        fontFamily: 'monospace',
        zIndex: 10
      }}>
        PROJECTION: EPSG:3857 • VECTOR SCAN T=0
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={380}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 320,
          maxHeight: 420,
          display: 'block',
          borderRadius: 4,
          cursor: hoveredNode ? 'pointer' : 'crosshair'
        }}
      />

      {/* Legend & Legend Footer */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(11, 19, 37, 0.85)',
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: '0.68rem',
        color: '#cbd5e1',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <span><strong style={{ color: '#e11d48' }}>●</strong> Critical POF &gt;85%</span>
          <span><strong style={{ color: '#ea580c' }}>●</strong> Warning 70-84%</span>
          <span><strong style={{ color: '#2563eb' }}>━</strong> 500kV Bulk</span>
          <span><strong style={{ color: '#f59e0b' }}>━</strong> 230kV Feeder</span>
        </div>
        <div style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }}>
          SCADA REFRESH: 400ms
        </div>
      </div>
    </div>
  );
}
