import { MapPin, Droplets, AlertTriangle, Navigation, Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface Hotspot {
  id: number;
  location: string;
  ward: string;
  zone: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  waterLevel: number;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
}

const HotspotMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  
  const hotspots: Hotspot[] = [
    {
      id: 1,
      location: "ITO Crossing",
      ward: "Ward 12",
      zone: "Central Delhi",
      severity: "critical",
      waterLevel: 85,
      lastUpdated: "5 mins ago",
      coordinates: { lat: 28.6289, lng: 77.2416 },
    },
    {
      id: 2,
      location: "Minto Bridge",
      ward: "Ward 8",
      zone: "Central Delhi",
      severity: "high",
      waterLevel: 72,
      lastUpdated: "12 mins ago",
      coordinates: { lat: 28.6304, lng: 77.2177 },
    },
    {
      id: 3,
      location: "Pul Prahladpur",
      ward: "Ward 45",
      zone: "South Delhi",
      severity: "medium",
      waterLevel: 45,
      lastUpdated: "20 mins ago",
      coordinates: { lat: 28.4955, lng: 77.2707 },
    },
    {
      id: 4,
      location: "Rajghat",
      ward: "Ward 15",
      zone: "Central Delhi",
      severity: "high",
      waterLevel: 68,
      lastUpdated: "8 mins ago",
      coordinates: { lat: 28.6419, lng: 77.2506 },
    },
    {
      id: 5,
      location: "Nizamuddin Bridge",
      ward: "Ward 18",
      zone: "South Delhi",
      severity: "critical",
      waterLevel: 92,
      lastUpdated: "3 mins ago",
      coordinates: { lat: 28.5889, lng: 77.2502 },
    },
    {
      id: 6,
      location: "Tilak Bridge",
      ward: "Ward 10",
      zone: "Central Delhi",
      severity: "medium",
      waterLevel: 55,
      lastUpdated: "15 mins ago",
      coordinates: { lat: 28.6185, lng: 77.2426 },
    },
  ];

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const mapWidth = 800;
    const mapHeight = 600;
    
    // Simple mercator-like projection centered on Delhi
    const x = ((lng - 77.0) * 40) + mapWidth / 2;
    const y = ((28.8 - lat) * 40) + mapHeight / 2;
    
    return { x, y };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'medium': return 'text-info bg-info/10 border-info/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const filteredHotspots = hotspots.filter(hotspot => {
    const matchesSearch = hotspot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotspot.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || hotspot.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Water-Logging Hotspots</h1>
          <p className="text-muted-foreground">Real-time monitoring across Delhi</p>
        </div>
        <Button className="modern-btn gap-2">
          <Navigation className="w-4 h-4" />
          My Location
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedSeverity === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedSeverity('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedSeverity === 'critical' ? 'destructive' : 'outline'}
                onClick={() => setSelectedSeverity('critical')}
                size="sm"
              >
                Critical
              </Button>
              <Button
                variant={selectedSeverity === 'high' ? 'default' : 'outline'}
                onClick={() => setSelectedSeverity('high')}
                size="sm"
              >
                High
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Interactive Hotspot Map</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetView}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className="relative h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Map SVG */}
            <svg 
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-700" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Delhi boundary (simplified) */}
              <ellipse 
                cx="400" 
                cy="300" 
                rx="200" 
                ry="180" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-primary/30"
                strokeDasharray="5,5"
              />
              
              {/* Major roads/connections */}
              <g className="text-slate-400 dark:text-slate-600" opacity="0.4">
                <line x1="300" y1="200" x2="500" y2="400" stroke="currentColor" strokeWidth="2" />
                <line x1="250" y1="300" x2="550" y2="300" stroke="currentColor" strokeWidth="2" />
                <line x1="400" y1="150" x2="400" y2="450" stroke="currentColor" strokeWidth="2" />
              </g>

              {/* Hotspot markers */}
              {filteredHotspots.map((hotspot) => {
                const { x, y } = latLngToXY(hotspot.coordinates.lat, hotspot.coordinates.lng);
                const isSelected = selectedHotspot?.id === hotspot.id;
                const markerSize = isSelected ? 16 : 12;
                
                return (
                  <g 
                    key={hotspot.id}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    {/* Pulse animation for critical hotspots */}
                    {hotspot.severity === 'critical' && (
                      <circle
                        cx={x}
                        cy={y}
                        r={markerSize + 8}
                        fill={getMarkerColor(hotspot.severity)}
                        opacity="0.2"
                        className="animate-ping"
                      />
                    )}
                    
                    {/* Marker circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={markerSize}
                      fill={getMarkerColor(hotspot.severity)}
                      stroke="white"
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                    
                    {/* Inner dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={markerSize / 3}
                      fill="white"
                      opacity="0.8"
                    />
                    
                    {/* Label */}
                    {isSelected && (
                      <g>
                        <rect
                          x={x - 60}
                          y={y - 40}
                          width="120"
                          height="30"
                          rx="4"
                          fill="white"
                          stroke={getMarkerColor(hotspot.severity)}
                          strokeWidth="2"
                          className="drop-shadow-xl"
                        />
                        <text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          className="text-xs font-semibold fill-slate-900"
                        >
                          {hotspot.location}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border">
              <h4 className="text-sm font-semibold mb-3">Severity Levels</h4>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <div key={severity} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMarkerColor(severity) }}
                    />
                    <span className="text-xs capitalize">{severity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info panel */}
            {selectedHotspot && (
              <div className="absolute top-4 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedHotspot.location}</h3>
                    <p className="text-sm text-muted-foreground">{selectedHotspot.ward} • {selectedHotspot.zone}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedHotspot(null)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${getSeverityColor(selectedHotspot.severity)}`}>
                  {selectedHotspot.severity.toUpperCase()}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        Water Level
                      </span>
                      <span className="text-sm font-bold">{selectedHotspot.waterLevel}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          selectedHotspot.waterLevel > 70 ? 'bg-destructive' :
                          selectedHotspot.waterLevel > 50 ? 'bg-warning' : 'bg-info'
                        }`}
                        style={{ width: `${selectedHotspot.waterLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Updated {selectedHotspot.lastUpdated}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-xs text-muted-foreground">
              Click markers to view details • Drag to pan • Use zoom controls
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHotspots.map((hotspot) => (
          <Card key={hotspot.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{hotspot.location}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {hotspot.ward}
                    </span>
                    <span>•</span>
                    <span>{hotspot.zone}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(hotspot.severity)}`}>
                  {hotspot.severity.toUpperCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-info" />
                      Water Level
                    </span>
                    <span className="text-sm font-bold">{hotspot.waterLevel}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        hotspot.waterLevel > 70 ? 'bg-destructive' :
                        hotspot.waterLevel > 50 ? 'bg-warning' : 'bg-info'
                      }`}
                      style={{ width: `${hotspot.waterLevel}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">{hotspot.lastUpdated}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary">
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHotspots.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hotspots found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HotspotMap;
