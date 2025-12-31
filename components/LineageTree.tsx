import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { LineageNode } from './lineage-data';
import type { Model } from '../types/index';

interface LineageTreeProps {
  onSelectModel: (model: Model) => void;
  nodes: LineageNode[];
  variant?: 'tree' | '3d-ring';
}

interface NodeLayout {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
  zIndex: number;
  opacity: number;
}

export const LineageTree: React.FC<LineageTreeProps> = ({
  onSelectModel,
  nodes,
  variant = 'tree',
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Constants
  const ROW_HEIGHT = 100;
  const NODE_WIDTH = 160;
  const NODE_HEIGHT = 50;

  // Calculate Layout map
  // Returns a map of id -> NodeLayout
  const layoutMap = useMemo(() => {
    const map = new Map<string, NodeLayout>();
    if (dimensions.width === 0) return map;

    if (variant === '3d-ring') {
      // 3D Ring Layout
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2; // Center vertically in container
      const rx = Math.min(dimensions.width * 0.4, 500); // Radius X
      const ry = 80; // Radius Y (flattened for 3D effect)

      // Identify nodes based on topology
      const sinkNode = nodes.find(n => n.id === 'rio-3.0-preview');
      const sourceNode = nodes.find(n => n.id === 'rio-2.5-omni-source');
      // Experts are everything else
      const satellites = nodes.filter(n => n.id !== 'rio-3.0-preview' && n.id !== 'rio-2.5-omni-source');

      // Place Satellites (Experts) on the Ring
      satellites.forEach((node, index) => {
        const total = satellites.length;
        const angle = (index / total) * Math.PI * 2;

        // 3D positioning
        const x3d = Math.cos(angle) * rx;
        const z3d = Math.sin(angle); // -1 (back) to 1 (front)

        // Project to screen
        const left = cx + x3d - NODE_WIDTH / 2;
        const top = cy + z3d * ry - 140 - NODE_HEIGHT / 2; // -140 to shift ring up

        // Depth effects
        const scale = 0.8 + (z3d + 1) * 0.15; // 0.8 to 1.1 scale
        const zIndex = Math.floor((z3d + 1) * 50) + 10; // 10 to 110 (Source will be in middle)
        const opacity = 0.6 + (z3d + 1) * 0.2; // 0.6 to 1.0 opacity

        map.set(node.id, {
          id: node.id,
          left,
          top,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          scale,
          zIndex,
          opacity,
        });
      });

      // Place Source Node (Rio 2.5 Omni) - Center of the Ring
      if (sourceNode) {
        // It should be "inside" the ring. 
        // For z-index, it should be behind front nodes but in front of back nodes?
        // Or just strictly in the center. 
        // Let's put it at z=0 equivalent.
        map.set(sourceNode.id, {
          id: sourceNode.id,
          left: cx - NODE_WIDTH / 2,
          top: cy - 140 - NODE_HEIGHT / 2, // Same 'y' center as the ring
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          scale: 1.0,
          zIndex: 60, // Middle of the pack (Ring is 10-110)
          opacity: 1,
        });
      }

      // Place Sink Node (Rio 3) - Bottom Center
      if (sinkNode) {
        map.set(sinkNode.id, {
          id: sinkNode.id,
          left: cx - NODE_WIDTH / 2,
          top: cy + 100, // Below the ring
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          scale: 1.2,
          zIndex: 200, // Always on top
          opacity: 1,
        });
      }

    } else {
      // Original Tree/Grid Layout
      nodes.forEach(node => {
        const colWidth = dimensions.width / 5;
        const left = node.x * colWidth + (colWidth - NODE_WIDTH) / 2;
        const top = node.y * ROW_HEIGHT + 40;

        map.set(node.id, {
          id: node.id,
          left,
          top,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          scale: 1,
          zIndex: 1,
          opacity: 1,
        });
      });
    }

    return map;
  }, [nodes, dimensions, variant]);

  // Helper to check if a connection should be highlighted
  const isConnectionActive = (sourceId: string, targetId: string) => {
    if (!hoveredNode) return false;
    return hoveredNode === sourceId || hoveredNode === targetId;
  };

  return (
    <div
      className="relative w-full overflow-hidden py-10 transition-all duration-500"
      ref={containerRef}
      style={{ minHeight: variant === '3d-ring' ? '600px' : '900px' }}
    >
      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
      {/* SVG Layer for Connections */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="8.4"
            refX="11"
            refY="4.2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 12 4.2, 0 8.4" fill="#cbd5e1" />
          </marker>
          <marker
            id="arrowhead-faded"
            markerWidth="12"
            markerHeight="8.4"
            refX="11"
            refY="4.2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 12 4.2, 0 8.4" fill="#cbd5e1" fillOpacity="0.1" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="22"
            markerHeight="15.4"
            refX="21"
            refY="7.7"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 22 7.7, 0 15.4" fill="#0070f3" />
          </marker>
        </defs>
        {(() => {
          // 1. Calculate all connections
          const connections = nodes
            .flatMap((node) =>
              node.parents.map((parentId) => {
                const parent = nodes.find((n) => n.id === parentId);
                if (!parent) return null;

                const parentLayout = layoutMap.get(parentId);
                const nodeLayout = layoutMap.get(node.id);
                if (!parentLayout || !nodeLayout) return null;

                const isActive = isConnectionActive(parent.id, node.id);
                const isFaded = hoveredNode && !isActive;
                const opacity = isFaded ? 0.05 : isActive ? 0.8 : 0.3; // Lower opacity for 3d ring base lines
                const color = isActive ? '#0070f3' : '#cbd5e1';
                const width = isActive ? 3 : 1.5;

                // Path Calculation
                let path = '';

                if (variant === '3d-ring') {
                  // Logic depends on connection type
                  // TYPE 1: Source (Center) -> Expert (Ring)
                  if (parentId === 'rio-2.5-omni-source') {
                    const startX = parentLayout.left + parentLayout.width / 2;
                    const startY = parentLayout.top + parentLayout.height / 2;
                    const endX = nodeLayout.left + nodeLayout.width / 2;
                    const endY = nodeLayout.top + nodeLayout.height / 2;
                    // Straight line is fine for radial burst, or slight arc?
                    // Straight line works well for "burst".
                    path = `M ${startX} ${startY} L ${endX} ${endY}`;
                  }
                  // TYPE 2: Expert (Ring) -> Sink (Bottom)
                  else {
                    const startX = parentLayout.left + parentLayout.width / 2;
                    const startY = parentLayout.top + parentLayout.height / 2;
                    const endX = nodeLayout.left + nodeLayout.width / 2;
                    const endY = nodeLayout.top + 10; // slightly inside top of target

                    const midY = (startY + endY) / 2;
                    path = `M ${startX} ${startY} Q ${startX} ${midY}, ${endX} ${endY}`;
                  }

                } else {
                  // Standard Grid Connections (Left/Right flow or Down flow)
                  // The original logic adjusted for side connection.
                  // Re-implementing original logic roughly:

                  const isParentHovered = hoveredNode === parent.id;
                  const scaleOffset = isParentHovered ? 6 : 0;

                  const startX = parentLayout.left + NODE_WIDTH + scaleOffset;
                  const startY = parentLayout.top + NODE_HEIGHT / 2;
                  const endX = nodeLayout.left - 6;
                  const endY = nodeLayout.top + NODE_HEIGHT / 2;

                  const landingDist = 16;
                  const curveEndX = endX - landingDist;
                  const absDist = Math.abs(curveEndX - startX);
                  const curvature = absDist > 300 ? 0.2 : 0.5;

                  const cp1X = startX + absDist * curvature;
                  const cp1Y = startY;
                  const cp2X = curveEndX - absDist * curvature;
                  const cp2Y = endY;

                  path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${curveEndX} ${endY} L ${endX} ${endY}`;
                }

                return {
                  key: `${parent.id}-${node.id}`,
                  path,
                  color,
                  width,
                  opacity,
                  isActive,
                  marker: isActive ? 'arrowhead-active' : isFaded ? 'arrowhead-faded' : 'arrowhead',
                  zIndex: isActive ? 100 : 0
                };
              })
            )
            .filter((conn): conn is NonNullable<typeof conn> => conn !== null);

          // 2. Sort: Active on top
          connections.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1));

          return connections.map((conn) => (
            <path
              key={conn.key}
              d={conn.path}
              fill="none"
              stroke={conn.color}
              strokeWidth={conn.width}
              strokeOpacity={conn.opacity}
              markerEnd={`url(#${conn.marker})`}
              className="transition-all duration-300"
              style={{ zIndex: conn.zIndex }}
            />
          ));
        })()}
      </svg>

      {/* Nodes Layer */}
      {nodes.map((node) => {
        const layout = layoutMap.get(node.id);
        if (!layout) return null;

        const isActive = hoveredNode === node.id;
        const isOmni = node.id === 'rio-omni' || node.id === 'rio-3.0-preview';
        const isTarget = node.id === 'rio-3.0-preview'; // Special styling for the center piece

        // Computed styles based on layout + interaction
        const finalScale = layout.scale * (isActive ? 1.05 : 1);
        const finalZIndex = layout.zIndex + (isActive ? 100 : 0);

        return (
          <div
            key={node.id}
            className={`absolute flex items-center justify-center p-3 sm:p-4 rounded-xl shadow-sm border transition-all duration-500 cursor-pointer
              ${isActive ? 'border-rio-primary shadow-lg ring-2 ring-rio-primary/20' : 'border-slate-200 bg-white/90 hover:border-rio-primary/50'}
              ${isTarget ? 'bg-gradient-to-br from-slate-900 to-rio-primary text-white border-transparent bg-[length:200%_200%] animate-gradient-xy' : ''}
              ${!isTarget && isOmni ? 'bg-slate-800 text-white border-none' : ''} 
            `}
            style={{
              left: layout.left,
              top: layout.top,
              width: layout.width,
              height: layout.height,
              zIndex: finalZIndex,
              opacity: layout.opacity,
              transform: `scale(${finalScale})`,
              boxShadow: isTarget && isActive ? '0 0 30px rgba(0, 112, 243, 0.4)' : undefined
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => {
              if (node.externalUrl) {
                window.open(node.externalUrl, '_blank');
              } else if (node.model) {
                onSelectModel(node.model);
              }
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3 w-full overflow-hidden">
              {(() => {
                const Icon = node.icon || node.model?.Icon;
                return (
                  Icon && (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isTarget || isOmni ? 'text-white' : 'text-slate-500'}`} />
                  )
                );
              })()}
              <span
                className={`font-medium text-xs sm:text-sm ${isTarget || isOmni ? 'text-white' : 'text-slate-700'}`}
              >
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
