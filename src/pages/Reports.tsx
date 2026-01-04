import { FileText, Plus, AlertCircle, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Report {
  id: number;
  title: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved';
  reportedBy: string;
  reportedAt: string;
}

const Reports = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const reports: Report[] = [
    {
      id: 1,
      title: "Severe water-logging at ITO",
      location: "ITO Crossing, Central Delhi",
      description: "Water level has reached 3 feet, causing major traffic disruption.",
      severity: "critical",
      status: "investigating",
      reportedBy: "Citizen Reporter",
      reportedAt: "2025-01-04 10:30 AM",
    },
    {
      id: 2,
      title: "Drainage overflow near Minto Bridge",
      location: "Minto Bridge, Ward 8",
      description: "Drainage system overflowing due to heavy rainfall.",
      severity: "high",
      status: "pending",
      reportedBy: "Municipal Officer",
      reportedAt: "2025-01-04 09:15 AM",
    },
    {
      id: 3,
      title: "Road flooding at Nizamuddin",
      location: "Nizamuddin Bridge, South Delhi",
      description: "Complete road blockage due to accumulated water. Emergency services notified.",
      severity: "critical",
      status: "investigating",
      reportedBy: "Traffic Police",
      reportedAt: "2025-01-04 08:45 AM",
    },
    {
      id: 4,
      title: "Minor water accumulation",
      location: "Rajghat, Ward 15",
      description: "Water pooling on sidewalk, pedestrian access affected.",
      severity: "medium",
      status: "pending",
      reportedBy: "Local Resident",
      reportedAt: "2025-01-04 07:20 AM",
    },
    {
      id: 5,
      title: "Drainage cleared successfully",
      location: "Tilak Bridge, Central Delhi",
      description: "Previously reported blockage has been cleared. Water receding normally.",
      severity: "low",
      status: "resolved",
      reportedBy: "Maintenance Team",
      reportedAt: "2025-01-03 04:30 PM",
    },
    {
      id: 6,
      title: "Pothole causing water retention",
      location: "Pul Prahladpur, Ward 45",
      description: "Large pothole collecting rainwater, needs immediate repair.",
      severity: "medium",
      status: "pending",
      reportedBy: "Citizen Reporter",
      reportedAt: "2025-01-03 02:15 PM",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-success bg-success/10 border-success/20';
      case 'investigating': return 'text-info bg-info/10 border-info/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const filteredReports = selectedStatus === 'all' 
    ? reports 
    : reports.filter(report => report.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Incident Reports</h1>
          <p className="text-muted-foreground">Submit and track water-logging incidents</p>
        </div>
        <Button className="modern-btn gap-2">
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Investigating</p>
                <p className="text-3xl font-bold">{reports.filter(r => r.status === 'investigating').length}</p>
              </div>
              <FileText className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <p className="text-3xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
              </div>
              <FileText className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
              size="sm"
            >
              All Reports
            </Button>
            <Button
              variant={selectedStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={selectedStatus === 'investigating' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('investigating')}
              size="sm"
            >
              Investigating
            </Button>
            <Button
              variant={selectedStatus === 'resolved' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('resolved')}
              size="sm"
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{report.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                <div className="flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{report.reportedAt}</span>
                  </div>
                  <div>By: <span className="font-medium">{report.reportedBy}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Update Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
