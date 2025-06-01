import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node types
const BasinNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 border-2 border-blue-400 rounded-full p-3 w-40 h-40 aspect-square backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm font-semibold text-blue-300 mb-1">{data.label}</div>
        <div className="w-20 h-20 mx-auto bg-blue-500/30 rounded-full border-2 border-blue-400 flex items-center justify-center mb-2">
          <div className="text-blue-200 text-sm font-bold">{data.id}</div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-blue-200">{data.temperature}°C</div>
          <div className="text-blue-200">{data.pressure} mbar</div>
          <div className="text-green-300">{data.status}</div>
        </div>
      </div>
    </div>
  );
};

const PumpNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 border-2 border-green-400 rounded-lg p-2 min-w-[80px] backdrop-blur-sm">
      <div className="text-center">
        <div className="text-xs font-semibold text-green-300 mb-1">{data.label}</div>
        <div className="w-10 h-10 mx-auto bg-green-500/30 rounded border-2 border-green-400 flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-green-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.87 2-1.76 2.5-2.5C15.5 23.76 17.09 22.87 18 22c5.16-1 9-5.45 9-11V7l-10-5z"/>
          </svg>
        </div>
        <div className="space-y-1 text-xs">
          <div className="text-green-200">{data.flow} L/min</div>
          <div className={`${data.active ? 'text-green-300' : 'text-red-300'}`}>
            {data.active ? 'AKTIV' : 'STOPP'}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 border-2 border-purple-400 rounded-lg p-2 min-w-[80px] backdrop-blur-sm">
      <div className="text-center">
        <div className="text-xs font-semibold text-purple-300 mb-1">{data.label}</div>
        <div className="w-8 h-8 mx-auto bg-purple-500/30 rounded border-2 border-purple-400 flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
          </svg>
        </div>
        <div className="space-y-1 text-xs">
          <div className="text-purple-200">{data.efficiency}%</div>
          <div className="text-purple-200">{data.status}</div>
        </div>
      </div>
    </div>
  );
};

const SystemNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-orange-700/20 border-2 border-orange-400 rounded-lg p-2 min-w-[90px] backdrop-blur-sm">
      <div className="text-center">
        <div className="text-xs font-semibold text-orange-300 mb-1">{data.label}</div>
        <div className="w-10 h-10 mx-auto bg-orange-500/30 rounded border-2 border-orange-400 flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-orange-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <div className="space-y-1 text-xs">
          <div className="text-orange-200">{data.value}</div>
          <div className="text-orange-200">{data.unit}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  basin: BasinNode,
  pump: PumpNode,
  filter: FilterNode,
  system: SystemNode,
};

const BasinFlowDiagram = () => {
  const initialNodes: Node[] = useMemo(() => [
    // Bassänger (6 stycken)
    {
      id: 'basin-1',
      type: 'basin',
      position: { x: 100, y: 200 },
      data: { 
        id: 'B1', 
        label: 'Bassäng 1', 
        temperature: 18.5, 
        pressure: 95, 
        status: 'Aktiv' 
      },
    },
    {
      id: 'basin-2',
      type: 'basin',
      position: { x: 300, y: 200 },
      data: { 
        id: 'B2', 
        label: 'Bassäng 2', 
        temperature: 19.2, 
        pressure: 92, 
        status: 'Aktiv' 
      },
    },
    {
      id: 'basin-3',
      type: 'basin',
      position: { x: 500, y: 200 },
      data: { 
        id: 'B3', 
        label: 'Bassäng 3', 
        temperature: 18.8, 
        pressure: 88, 
        status: 'Standby' 
      },
    },
    {
      id: 'basin-4',
      type: 'basin',
      position: { x: 100, y: 400 },
      data: { 
        id: 'B4', 
        label: 'Bassäng 4', 
        temperature: 19.0, 
        pressure: 90, 
        status: 'Aktiv' 
      },
    },
    {
      id: 'basin-5',
      type: 'basin',
      position: { x: 300, y: 400 },
      data: { 
        id: 'B5', 
        label: 'Bassäng 5', 
        temperature: 18.7, 
        pressure: 94, 
        status: 'Aktiv' 
      },
    },
    {
      id: 'basin-6',
      type: 'basin',
      position: { x: 500, y: 400 },
      data: { 
        id: 'B6', 
        label: 'Bassäng 6', 
        temperature: 19.1, 
        pressure: 91, 
        status: 'Underhåll' 
      },
    },
    
    // Pumpar
    {
      id: 'pump-1',
      type: 'pump',
      position: { x: 150, y: 100 },
      data: { 
        label: 'Pump P1', 
        flow: 45, 
        active: true 
      },
    },
    {
      id: 'pump-2',
      type: 'pump',
      position: { x: 350, y: 100 },
      data: { 
        label: 'Pump P2', 
        flow: 38, 
        active: true 
      },
    },
    {
      id: 'pump-3',
      type: 'pump',
      position: { x: 550, y: 100 },
      data: { 
        label: 'Pump P3', 
        flow: 0, 
        active: false 
      },
    },
    
    // Filter
    {
      id: 'filter-1',
      type: 'filter',
      position: { x: 200, y: 320 },
      data: { 
        label: 'Filter F1', 
        efficiency: 94, 
        status: 'OK' 
      },
    },
    {
      id: 'filter-2',
      type: 'filter',
      position: { x: 400, y: 320 },
      data: { 
        label: 'Filter F2', 
        efficiency: 89, 
        status: 'Rengöring' 
      },
    },
    
    // System komponenter
    {
      id: 'vacuum',
      type: 'system',
      position: { x: 50, y: 50 },
      data: { 
        label: 'Vakuumenhet', 
        value: '85', 
        unit: 'mbar' 
      },
    },
    {
      id: 'dryer',
      type: 'system',
      position: { x: 650, y: 50 },
      data: { 
        label: 'Torkningskühler', 
        value: '42', 
        unit: '°C' 
      },
    },
    {
      id: 'heat-recovery',
      type: 'system',
      position: { x: 650, y: 300 },
      data: { 
        label: 'Värmeåtervinning', 
        value: '78', 
        unit: '%' 
      },
    },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    // Pumpar till bassänger
    { id: 'e1-1', source: 'pump-1', target: 'basin-1', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e1-2', source: 'pump-1', target: 'basin-4', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e2-1', source: 'pump-2', target: 'basin-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e2-2', source: 'pump-2', target: 'basin-5', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e3-1', source: 'pump-3', target: 'basin-3', type: 'smoothstep', style: { stroke: '#6b7280', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e3-2', source: 'pump-3', target: 'basin-6', type: 'smoothstep', style: { stroke: '#6b7280', strokeWidth: 2, strokeDasharray: '5,5' } },
    
    // Filter kopplingar
    { id: 'ef1-1', source: 'basin-1', target: 'filter-1', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'ef1-2', source: 'basin-4', target: 'filter-1', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'ef2-1', source: 'basin-2', target: 'filter-2', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'ef2-2', source: 'basin-5', target: 'filter-2', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    
    // System kopplingar
    { id: 'ev1', source: 'vacuum', target: 'pump-1', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'ev2', source: 'vacuum', target: 'pump-2', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'ed1', source: 'dryer', target: 'basin-3', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'ed2', source: 'dryer', target: 'basin-6', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'eh1', source: 'heat-recovery', target: 'filter-2', type: 'smoothstep', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-transparent"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#374151" 
        />
        <Controls className="bg-slate-800/80 border border-slate-600" />
        <MiniMap 
          className="bg-slate-800/80 border border-slate-600" 
          nodeColor={(node) => {
            switch (node.type) {
              case 'basin': return '#3b82f6';
              case 'pump': return '#10b981';
              case 'filter': return '#8b5cf6';
              case 'system': return '#f59e0b';
              default: return '#6b7280';
            }
          }}
        />
        <Panel position="top-left" className="bg-slate-800/90 p-3 rounded-lg border border-slate-600">
          <h3 className="text-white font-semibold mb-2">Systemöversikt</h3>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Bassänger (6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Pumpar (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Filter (2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>System (3)</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default BasinFlowDiagram;