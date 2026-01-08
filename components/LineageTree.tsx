import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LineageNode } from './lineage-data';
import type { Model } from '../types/index';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface LineageTreeProps {
  onSelectModel: (model: Model) => void;
  nodes: LineageNode[];
  variant?: 'tree' | '3d-ring';
  direction?: 'forward' | 'backward';
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

// Helper to find intersection point between a line (from center to target) and a rectangle
// defined by center, width, height
function getRectIntersection(
  center: { x: number; y: number },
  width: number,
  height: number,
  target: { x: number; y: number }
) {
  const dx = target.x - center.x;
  const dy = target.y - center.y;

  if (dx === 0 && dy === 0) return center;

  const halfW = width / 2;
  const halfH = height / 2;

  // Calculate t for x collision: center.x + dx * t = center.x +/- halfW
  // t = (+/- halfW) / dx
  const tx = dx !== 0 ? Math.abs(halfW / dx) : Infinity;

  // Calculate t for y collision
  const ty = dy !== 0 ? Math.abs(halfH / dy) : Infinity;

  const t = Math.min(tx, ty);

  // The intersection point
  return {
    x: center.x + dx * t,
    y: center.y + dy * t
  };
}

export const LineageTree: React.FC<LineageTreeProps> = ({
  onSelectModel,
  nodes,
  variant = 'tree',
  direction = 'forward',
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
        .node-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>
      {/* SVG Layer for Connections */}
      <svg
        key={`svg-${nodes.map(n => n.id).join('-')}`}
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      >
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

                const expertNodeId =
                  variant === '3d-ring'
                    ? [parentId, node.id].find(
                      (id) =>
                        id !== 'rio-2.5-omni-source' && id !== 'rio-3.0-preview'
                    )
                    : null;

                let baseOpacity = 0.4;
                let activeOpacity = 0.85;

                if (variant === '3d-ring' && expertNodeId) {
                  const layout = layoutMap.get(expertNodeId);
                  if (layout) {
                    // layout.opacity ranges from ~0.6 (back) to 1.0 (front)
                    // Normalize this to 0..1 for easier mapping
                    const normalized = Math.max(0, (layout.opacity - 0.6) / 0.4);
                    // Map to desired opacity range: faint (0.2) to distinct (0.7)
                    baseOpacity = 0.2 + normalized * 0.5;
                    // Active range: 0.4 (back) to 1.0 (front)
                    activeOpacity = 0.4 + normalized * 0.6;
                  }
                }

                const isActive = isConnectionActive(parent.id, node.id);
                const isFaded = hoveredNode && !isActive;
                const opacity = isFaded ? 0.05 : isActive ? activeOpacity : baseOpacity; // Dynamic opacity for 3d ring
                const color = isActive ? '#0070f3' : '#cbd5e1';
                const width = isActive ? 3 : 1.5;

                // Path Calculation
                let path = '';

                if (variant === '3d-ring') {
                  // Logic depends on connection type
                  // TYPE 1: Source (Center) -> Expert (Ring)
                  if (parentId === 'rio-2.5-omni-source') {
                    const sourceCx = parentLayout.left + parentLayout.width / 2;
                    const sourceCy = parentLayout.top + parentLayout.height / 2;
                    const targetCx = nodeLayout.left + nodeLayout.width / 2;
                    const targetCy = nodeLayout.top + nodeLayout.height / 2;

                    // Calculate start point (intersection with Source rect)
                    const start = getRectIntersection(
                      { x: sourceCx, y: sourceCy },
                      parentLayout.width,
                      parentLayout.height,
                      { x: targetCx, y: targetCy }
                    );

                    // Calculate end point (intersection with Expert rect)
                    const end = getRectIntersection(
                      { x: targetCx, y: targetCy },
                      nodeLayout.width,
                      nodeLayout.height,
                      { x: sourceCx, y: sourceCy }
                    );

                    path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                  }
                  // TYPE 2: Expert (Ring) -> Sink (Bottom)
                  else {
                    const expertCx = parentLayout.left + parentLayout.width / 2;
                    const expertCy = parentLayout.top + parentLayout.height / 2;
                    const sinkCx = nodeLayout.left + nodeLayout.width / 2;
                    const sinkCy = nodeLayout.top + nodeLayout.height / 2;

                    // The original logic used:
                    // const startX = expertCx;
                    // const startY = expertCy;
                    // const endX = sinkCx;
                    // const endY = nodeLayout.top + 10;
                    // const midY = (startY + endY) / 2;
                    // path = `M ${startX} ${startY} Q ${startX} ${midY}, ${endX} ${endY}`;

                    // New logic with clipping:
                    // 1. The curve leaves Expert vertically downwards.
                    //    Start point should be bottom-center of Expert.
                    const start = {
                      x: expertCx,
                      y: expertCy + parentLayout.height / 2
                    };

                    // 2. The curve approaches Sink. The control point is (start.x, midY).
                    //    Tangent at endpoint is roughly distinct from vertical.
                    //    We can treat the "incoming ray" as coming from the Control Point.
                    //    Let's calculate approximate End point by intersecting Sink box 
                    //    with the line from SinkCenter to ControlPoint.

                    // Rough geometric control point Y used in previous logic was avg(start, end).
                    // Let's preserve the shape but clip the end.

                    const originalTargetY = nodeLayout.top + nodeLayout.height / 2; // Aiming for center visually for the curve calculation
                    const midY = (expertCy + originalTargetY) / 2;
                    const controlPoint = { x: expertCx, y: midY };

                    // Intersect Sink Rect with ray from SinkCenter to ControlPoint
                    const end = getRectIntersection(
                      { x: sinkCx, y: sinkCy },
                      nodeLayout.width,
                      nodeLayout.height,
                      controlPoint
                    );

                    path = `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y}, ${end.x} ${end.y}`;
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

                // Calculate cascade delay based on connection type and position
                let cascadeDelay = 0.16;
                if (variant === '3d-ring') {
                  // Source→Expert connections draw first, Expert→Sink draw after
                  if (parentId === 'rio-2.5-omni-source') {
                    cascadeDelay = 0.25; // First wave
                  } else {
                    cascadeDelay = 0.75; // Second wave (after experts appear)
                  }
                } else {
                  // Tree view: delay based on parent's horizontal position (left→right flow)
                  cascadeDelay = 0.16 + (parent.x || 0) * 0.125;
                }

                return {
                  key: `${parent.id}-${node.id}`,
                  path,
                  color,
                  width,
                  opacity,
                  isActive,
                  marker: isActive ? 'arrowhead-active' : isFaded ? 'arrowhead-faded' : 'arrowhead',
                  zIndex: isActive ? 100 : 0,
                  cascadeDelay
                };
              })
            )
            .filter((conn): conn is NonNullable<typeof conn> => conn !== null);

          // 2. Sort: Active on top
          connections.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1));

          return connections.map((conn) => (
            <motion.path
              key={conn.key}
              d={conn.path}
              fill="none"
              stroke={conn.color}
              strokeWidth={conn.width}
              opacity={conn.opacity}
              markerEnd={`url(#${conn.marker})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: conn.opacity,
                stroke: conn.color,
                strokeWidth: conn.width
              }}
              transition={{
                pathLength: { type: 'tween', duration: 0.8, ease: 'linear', delay: conn.cascadeDelay },
                opacity: { duration: 0.15 },
                stroke: { duration: 0.15 },
                strokeWidth: { duration: 0.15 }
              }}
              className="transition-none"
              style={{ zIndex: conn.zIndex }}
            />
          ));
        })()}
      </svg>

      {/* Nodes Layer */}
      <AnimatePresence mode="popLayout">
        {nodes.map((node, index) => {
          const layout = layoutMap.get(node.id);
          if (!layout) return null;

          const isActive = hoveredNode === node.id;
          const hasDetailPage = node.hasDetailPage;
          const hasExternalUrl = !!node.externalUrl;
          const isClickable = hasDetailPage || hasExternalUrl;

          const finalScale = layout.scale * (isActive ? 1.03 : 1);
          const finalZIndex = layout.zIndex + (isActive ? 100 : 0);

          const xOffset = direction === 'forward' ? 40 : -40;

          return (
            <motion.div
              layout
              key={node.id}
              initial={{
                opacity: 0,
                scale: 0.6,
                x: layout.left + xOffset,
                y: layout.top,
                rotateX: -10
              }}
              animate={{
                opacity: layout.opacity,
                scale: finalScale,
                x: layout.left,
                y: layout.top,
                rotateX: 0,
                rotateY: 0,
              }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
              whileHover={isClickable ? {
                z: 20,
                rotateX: -2,
                rotateY: 2,
                scale: finalScale * 1.02,
                transition: { duration: 0.12 }
              } : {}}
              transition={{
                layout: { type: 'spring', stiffness: 200, damping: 25 },
                opacity: { duration: 0.4, delay: index * 0.04 },
                scale: { type: 'spring', stiffness: 400, damping: 25, delay: index * 0.04 },
                x: { type: 'spring', stiffness: 200, damping: 22, delay: index * 0.04 },
              }}
              className={`absolute flex items-center justify-center p-3 sm:p-4 rounded-xl border transition-colors duration-150
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                bg-white/90 backdrop-blur-sm shadow-sm border-slate-200
                ${isActive
                  ? 'border-rio-primary/60 shadow-md ring-2 ring-rio-primary/15'
                  : 'hover:border-slate-300 hover:shadow-md'
                }
              `}
              style={{
                width: layout.width,
                height: layout.height,
                zIndex: finalZIndex,
                position: 'absolute',
                left: 0,
                top: 0,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                if (node.externalUrl) {
                  window.open(node.externalUrl, '_blank');
                } else if (node.model && node.hasDetailPage) {
                  onSelectModel(node.model);
                }
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
                {(() => {
                  const Icon = node.icon || node.model?.Icon;
                  return (
                    Icon && (
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors duration-150
                          ${isActive ? 'text-rio-primary' : 'text-slate-500'}`}
                      />
                    )
                  );
                })()}
                <span
                  className={`text-xs sm:text-sm flex-1 font-medium transition-colors duration-150
                    ${isActive ? 'text-slate-800' : 'text-slate-600'}`}
                >
                  {node.label}
                </span>
                {/* Action indicator icons */}
                {hasDetailPage && (
                  <ChevronRight
                    className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-all duration-300 
                      ${isActive
                        ? 'translate-x-0.5 text-rio-primary opacity-100'
                        : 'text-slate-300 opacity-70 group-hover:opacity-100'
                      }`}
                  />
                )}
                {hasExternalUrl && (
                  <ExternalLink
                    className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-all duration-300 
                      ${isActive
                        ? 'text-rio-primary opacity-100'
                        : 'text-slate-400 opacity-60'
                      }`}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
