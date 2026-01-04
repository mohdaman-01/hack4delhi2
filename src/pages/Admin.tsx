import { Shield, Users, Activity, Settings, Database, Bell, MapPin, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">System administration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Manage user accounts, roles, and permissions for citizens and officials.
            </p>
            <div className="text-2xl font-bold">342 Users</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-info/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-6 h-6 text-info" />
            </div>
            <CardTitle className="text-xl">Zone Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Configure Delhi zones, wards, and administrative boundaries.
            </p>
            <div className="text-2xl font-bold">11 Zones</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-success/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Database className="w-6 h-6 text-success" />
            </div>
            <CardTitle className="text-xl">Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Manage hotspot data, historical records, and system backups.
            </p>
            <div className="text-2xl font-bold">98% Health</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-warning/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Settings className="w-6 h-6 text-warning" />
            </div>
            <CardTitle className="text-xl">System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Configure alert thresholds, notification rules, and system parameters.
            </p>
            <div className="text-2xl font-bold">18 Settings</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-destructive/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Alert System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Manage emergency alerts, notifications, and communication channels.
            </p>
            <div className="text-2xl font-bold">8 Active</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Drainage Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Monitor and manage drainage infrastructure and maintenance schedules.
            </p>
            <div className="text-2xl font-bold">156 Points</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">API Server</span>
              </div>
              <p className="text-xs text-muted-foreground">Running smoothly</p>
            </div>
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">Weather API</span>
              </div>
              <p className="text-xs text-muted-foreground">Syncing data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
