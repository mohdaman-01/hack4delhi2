import { MapPin, Droplets, AlertTriangle, Navigation, Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

// Access global Leaflet object
declare const L: any;

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

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

  const filteredHotspots = hotspots.filter(hotspot => {
    const matchesSearch = hotspot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotspot.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || hotspot.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Initialize map centered on Delhi
      const map = L.map(mapRef.current).setView([28.6139, 77.2090], 12);

      // Add a nice basemap (CartoDB Voyager is clean and modern)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    filteredHotspots.forEach(hotspot => {
      const color = getMarkerColor(hotspot.severity);

      // Create a pulsating effect for critical hotspots
      const isCritical = hotspot.severity === 'critical';

      const marker = L.circleMarker([hotspot.coordinates.lat, hotspot.coordinates.lng], {
        radius: isCritical ? 12 : 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: isCritical ? 'animate-pulse' : ''
      });

      marker.addTo(mapInstanceRef.current);

      // Add popup
      const popupContent = `
        <div class="p-1 min-w-[150px]">
          <h3 class="font-bold text-sm mb-1">${hotspot.location}</h3>
          <p class="text-xs text-gray-500 mb-2">${hotspot.ward}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-0.5 rounded text-white" style="background-color: ${color}">
              ${hotspot.severity.toUpperCase()}
            </span>
            <span class="text-xs font-semibold">${hotspot.waterLevel}% WL</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedHotspot(hotspot);
        // Optionally center map on click
        // mapInstanceRef.current.setView(marker.getLatLng(), 14);
      });

      markersRef.current.push(marker);
    });
  }, [filteredHotspots]);

  // Handle Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView([28.6139, 77.2090], 12);
  };

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
        <CardContent className="p-0 relative">
          {/* Map Container */}
          <div
            ref={mapRef}
            className="h-[600px] w-full z-0"
            style={{ isolation: 'isolate' }}
          />

          {/* Info panel overlay */}
          {selectedHotspot && (
            <div className="absolute top-4 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 border z-[1000] animate-in fade-in slide-in-from-right-10 duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedHotspot.location}</h3>
                  <p className="text-sm text-muted-foreground">{selectedHotspot.ward} • {selectedHotspot.zone}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
                      className={`h-full transition-all ${selectedHotspot.waterLevel > 70 ? 'bg-destructive' :
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

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border z-[1000]">
            <h4 className="text-xs font-semibold mb-2">Severity Levels</h4>
            <div className="space-y-1.5">
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <div key={severity} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getMarkerColor(severity) }}
                  />
                  <span className="text-xs capitalize">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid view of hotspots */}
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
                      className={`h-full transition-all duration-500 ${hotspot.waterLevel > 70 ? 'bg-destructive' :
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
