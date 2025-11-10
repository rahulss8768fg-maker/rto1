"use client";
import { useState, useEffect } from "react";
import { ref, onValue, off, update } from "firebase/database";
import { auth, database } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft,
  Smartphone, 
  CreditCard,
  Settings,
  MessageSquare,
  FileText,
  Save,
  RefreshCw,
  Power,
  Signal,
  Battery,
  Download,
  Phone,
  Calendar,
  MapPin,
  User,
  Network,
  Shield,
  Send,
  PhoneCall,
  PhoneForwarded,
  Copy
} from "lucide-react";
import { toast } from "sonner";

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.id;

  const [device, setDevice] = useState(null);
  const [deviceSMS, setDeviceSMS] = useState([]);
  const [deviceEntries, setDeviceEntries] = useState([]);
  const [simInfo, setSimInfo] = useState(null);
  const [deviceSettings, setDeviceSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [entriesModalOpen, setEntriesModalOpen] = useState(false);
  const [sendSmsModalOpen, setSendSmsModalOpen] = useState(false);
  const [callForwardingModalOpen, setCallForwardingModalOpen] = useState(false);
  const [filteredSMS, setFilteredSMS] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedSIM, setSelectedSIM] = useState(0);
  const [forwardingSettings, setForwardingSettings] = useState({
    forwarding_status: false,
    forwarding_number: '',
    subscription_id: '1'
  });
  const [smsForm, setSmsForm] = useState({
    recipient: '',
    message: ''
  });

  useEffect(() => {
    // Auth check
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    if (!deviceId) return;

    // Load device info
    const deviceRef = ref(database, `devices/${deviceId}`);
    const deviceListener = onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        setDevice({ id: deviceId, ...snapshot.val() });
      }
    });

    // Load device SMS
    const smsRef = ref(database, "sms");
    const smsListener = onValue(smsRef, (snapshot) => {
      if (snapshot.exists()) {
        const smsData = snapshot.val();
        const deviceSMSArray = Object.keys(smsData)
          .filter(key => smsData[key].imei === deviceId || smsData[key].deviceId === deviceId)
          .map(key => {
            const sms = smsData[key];
            let timestamp = Date.now(); // Default to current time
            
            // Try to get timestamp from different possible fields
            if (sms.timestamp) {
              timestamp = typeof sms.timestamp === 'string' 
                ? new Date(sms.timestamp).getTime() 
                : sms.timestamp;
            } else if (sms.time) {
              timestamp = typeof sms.time === 'string' 
                ? new Date(sms.time).getTime() 
                : sms.time;
            } else if (sms.date) {
              timestamp = typeof sms.date === 'string' 
                ? new Date(sms.date).getTime() 
                : sms.date;
            }
            
            // Ensure timestamp is valid
            if (isNaN(timestamp)) {
              timestamp = Date.now();
            }
            
            return {
              id: key,
              ...sms,
              timestamp: timestamp
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp); // Latest first (descending order)
        setDeviceSMS(deviceSMSArray);
      } else {
        setDeviceSMS([]);
      }
    });

    // Load device entries
    const entriesRef = ref(database, "entries");
    const entriesListener = onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const entriesData = snapshot.val();
        const deviceEntriesArray = Object.keys(entriesData)
          .filter(key => entriesData[key].imei === deviceId || entriesData[key].deviceId === deviceId)
          .map(key => {
            const entry = entriesData[key];
            let timestamp = Date.now(); // Default to current time
            
            // Try to get timestamp from different possible fields
            if (entry.timestamp) {
              timestamp = typeof entry.timestamp === 'string' 
                ? new Date(entry.timestamp).getTime() 
                : entry.timestamp;
            } else if (entry.time) {
              timestamp = typeof entry.time === 'string' 
                ? new Date(entry.time).getTime() 
                : entry.time;
            } else if (entry.date) {
              timestamp = typeof entry.date === 'string' 
                ? new Date(entry.date).getTime() 
                : entry.date;
            }
            
            // Ensure timestamp is valid
            if (isNaN(timestamp)) {
              timestamp = Date.now();
            }
            
            return {
              id: key,
              ...entry,
              timestamp: timestamp
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp); // Latest first (descending order)
        setDeviceEntries(deviceEntriesArray);
      } else {
        setDeviceEntries([]);
      }
    });

    // Load SIM info
    const simRef = ref(database, `sim_info/${deviceId}`);
    const simListener = onValue(simRef, (snapshot) => {
      if (snapshot.exists()) {
        setSimInfo(snapshot.val());
      } else {
        setSimInfo(null);
      }
    });

    // Load call forwarding settings
    const forwardingRef = ref(database, `forworder/${deviceId}`);
    const forwardingListener = onValue(forwardingRef, (snapshot) => {
      if (snapshot.exists()) {
        setForwardingSettings(snapshot.val());
      } else {
        setForwardingSettings({
          forwarding_status: false,
          forwarding_number: '',
          subscription_id: '1'
        });
      }
    });

    // Load device settings
    const settingsRef = ref(database, `devices/${deviceId}/settings`);
    const settingsListener = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setDeviceSettings(snapshot.val());
      } else {
        // Default settings if none exist
        setDeviceSettings({
          autoForwardCalls: false,
          autoForwardSMS: false,
          recordCalls: false,
          enableNotifications: true,
          maxStorageDays: 30,
          autoSync: true
        });
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      off(deviceRef, "value", deviceListener);
      off(smsRef, "value", smsListener);
      off(entriesRef, "value", entriesListener);
      off(simRef, "value", simListener);
      off(settingsRef, "value", settingsListener);
      off(forwardingRef, "value", forwardingListener);
    };
  }, [deviceId, router]);

  const saveDeviceSettings = async () => {
    try {
      await update(ref(database, `devices/${deviceId}/settings`), deviceSettings);
      toast.success("Device settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save device settings");
    }
  };

  const toggleDeviceStatus = async () => {
    if (!device) return;
    try {
      await update(ref(database, `devices/${deviceId}`), {
        status: !device.status,
        timestamp: Date.now()
      });
      toast.success("Device status updated!");
    } catch (error) {
      toast.error("Failed to update device status");
    }
  };

  const showSMSModal = () => {
    setFilteredSMS(deviceSMS);
    setSmsModalOpen(true);
  };

  const showEntriesModal = () => {
    setFilteredEntries(deviceEntries);
    setEntriesModalOpen(true);
  };

  const exportDeviceData = (type) => {
    let data, filename;
    
    if (type === 'sms') {
      data = deviceSMS;
      filename = `${deviceId}-sms.csv`;
    } else {
      data = deviceEntries;
      filename = `${deviceId}-entries.csv`;
    }

    const csvContent = [
      type === 'sms' 
        ? ['Sender', 'Receiver', 'Message', 'Type', 'Date', 'Time'].join(',')
        : ['Type', 'Phone Number', 'Date', 'Time'].join(','),
      ...data.map(item => 
        type === 'sms'
          ? [item.sender || '', item.receiver || '', `"${item.content || item.message || ''}"`, item.type || '', new Date(item.timestamp).toLocaleDateString(), new Date(item.timestamp).toLocaleTimeString()].join(',')
          : [item.type || '', item.phoneNumber || '', new Date(item.timestamp).toLocaleDateString(), new Date(item.timestamp).toLocaleTimeString()].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filterSMS = (term) => {
    if (!term) {
      setFilteredSMS(deviceSMS);
    } else {
      const filtered = deviceSMS.filter(sms => 
        sms.sender?.includes(term) ||
        sms.receiver?.includes(term) ||
        sms.content?.toLowerCase().includes(term.toLowerCase()) ||
        sms.message?.toLowerCase().includes(term.toLowerCase())
      ).sort((a, b) => b.timestamp - a.timestamp); // Maintain latest first sorting after filter
      setFilteredSMS(filtered);
    }
  };

  const filterEntries = (term) => {
    if (!term) {
      setFilteredEntries(deviceEntries);
    } else {
      const filtered = deviceEntries.filter(entry => 
        entry.phoneNumber?.includes(term) ||
        entry.type?.toLowerCase().includes(term.toLowerCase())
      ).sort((a, b) => b.timestamp - a.timestamp); // Maintain latest first sorting after filter
      setFilteredEntries(filtered);
    }
  };

  // Send SMS function
  const sendSMS = async () => {
    if (!smsForm.recipient || !smsForm.message) {
      toast.error("Please fill both recipient and message fields");
      return;
    }

    try {
      const selectedSIMInfo = simInfo?.sim_info?.[selectedSIM];
      await update(ref(database, `sendsms/${deviceId}`), {
        from: selectedSIMInfo?.subscriptionId || '1',
        to: smsForm.recipient,
        sms: smsForm.message
      });

      toast.success("SMS sent successfully!");
      setSmsForm({ recipient: '', message: '' });
      setSendSmsModalOpen(false);
    } catch (error) {
      toast.error("Failed to send SMS");
    }
  };

  // Update call forwarding settings
  const updateCallForwarding = async (settings) => {
    try {
      const selectedSIMInfo = simInfo?.sim_info?.[selectedSIM];
      await update(ref(database, `forworder/${deviceId}`), {
        ...settings,
        subscription_id: selectedSIMInfo?.subscriptionId || '1',
        index: selectedSIM
      });
      
      toast.success("Call forwarding settings updated!");
      setCallForwardingModalOpen(false);
    } catch (error) {
      toast.error("Failed to update call forwarding settings");
    }
  };

  if (loading || !device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading device information...</p>
        </div>
      </div>
    );
  }

  const isOnline = (Date.now() - (device.lastSeen || 0)) < 300000; // 5 minutes

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto space-y-4 p-3">
        {/* Mobile Header */}
        <Card className="p-3 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-0">
            <div className="flex items-center justify-between mb-2">
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant={isOnline ? 'default' : 'secondary'} className="text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
            <CardTitle className="text-sm flex items-center">
              <Smartphone className="mr-2 h-4 w-4" />
              {device.deviceName || deviceId}
            </CardTitle>
            <CardDescription className="text-xs">
              Device ID: {deviceId}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Button 
              onClick={toggleDeviceStatus}
              variant={device.status ? 'destructive' : 'default'}
              size="sm"
              className="w-full text-xs"
            >
              <Power className="mr-2 h-3 w-3" />
              {device.status ? 'Disable Device' : 'Enable Device'}
            </Button>
          </CardContent>
        </Card>

        {/* Device Stats - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{deviceSMS.length}</div>
              <p className="text-xs text-muted-foreground">Messages</p>
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
              <div className="text-lg font-bold">{deviceEntries.length}</div>
              <p className="text-xs text-muted-foreground">Records</p>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <Battery className="h-3 w-3 mr-1 text-muted-foreground" />
                Battery
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{device.battery_status?.battery_percentage || 'N/A'}%</div>
              <p className="text-xs text-muted-foreground">
                {device.battery_status?.charging_status || 'Unknown'}
              </p>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader className="pb-2 px-0">
              <CardTitle className="text-xs font-medium flex items-center">
                <Signal className="h-3 w-3 mr-1 text-muted-foreground" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg font-bold">{device.status ? 'Online' : 'Offline'}</div>
              <p className="text-xs text-muted-foreground">
                {new Date(device.timestamp || 0).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Device Information Card */}
        <Card className="p-3 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center text-sm">
              <Smartphone className="mr-2 h-4 w-4" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-2">
            <div className="flex items-center text-xs">
              <User className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
              <span className="text-muted-foreground mr-1">Name:</span>
              <span className="font-medium truncate">{device.device_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-xs">
              <Smartphone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
              <span className="text-muted-foreground mr-1">Brand:</span>
              <span className="font-medium truncate">{device.brand || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-xs">
              <Settings className="mr-1 h-3 w-3 text-orange-600 flex-shrink-0" />
              <span className="text-muted-foreground mr-1">Manufacturer:</span>
              <span className="font-medium">{device.manufacturer || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-xs">
              <Shield className="mr-1 h-3 w-3 text-purple-600 flex-shrink-0" />
              <span className="text-muted-foreground mr-1">IMEI:</span>
              <span className="font-medium">{device.imei || deviceId}</span>
            </div>
            <div className="flex items-center text-xs">
              <Network className="mr-1 h-3 w-3 text-indigo-600 flex-shrink-0" />
              <span className="text-muted-foreground mr-1">Status:</span>
              <Badge variant={device.status ? "default" : "secondary"} className="text-xs">
                {device.status ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* SIM Information Card with Tabs */}
        {simInfo && simInfo.sim_info && (
          <Card className="p-3 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  SIM Cards ({simInfo.sim_info.length})
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    onClick={() => setSendSmsModalOpen(true)}
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send SMS
                  </Button>
                  <Button
                    onClick={() => setCallForwardingModalOpen(true)}
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1"
                  >
                    <PhoneForwarded className="h-3 w-3 mr-1" />
                    Forward
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {/* SIM Tabs */}
              <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
                {simInfo.sim_info.map((sim, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSIM(index)}
                    className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                      selectedSIM === index
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span className="font-medium">{sim.displayName}</span>
                    </div>
                    <div className="text-xs opacity-80">
                      {sim.phoneNumber}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected SIM Details */}
              {simInfo.sim_info[selectedSIM] && (
                <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                  <div className="flex items-center text-xs">
                    <Phone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground mr-1">Phone:</span>
                    <span className="font-medium">{simInfo.sim_info[selectedSIM].phoneNumber}</span>
                    <Button
                      onClick={() => navigator.clipboard.writeText(simInfo.sim_info[selectedSIM].phoneNumber)}
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0 h-auto"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center text-xs">
                    <CreditCard className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                    <span className="text-muted-foreground mr-1">Subscription ID:</span>
                    <span className="font-medium">{simInfo.sim_info[selectedSIM].subscriptionId}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Network className="mr-1 h-3 w-3 text-purple-600 flex-shrink-0" />
                    <span className="text-muted-foreground mr-1">Network:</span>
                    <span className="font-medium">{simInfo.sim_info[selectedSIM].displayName}</span>
                  </div>
                  
                  {/* Call Forwarding Status */}
                  <div className="flex items-center justify-between text-xs border-t pt-2 mt-2">
                    <span className="text-muted-foreground">Call Forwarding:</span>
                    <Badge variant={forwardingSettings.forwarding_status ? "default" : "secondary"}>
                      {forwardingSettings.forwarding_status ? `Active → ${forwardingSettings.forwarding_number}` : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Device Settings Card */}
        {/* <Card className="p-3 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Device Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-3">
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
              <Label className="text-xs">Auto Forward Calls</Label>
              <Switch
                checked={deviceSettings.autoForwardCalls || false}
                onCheckedChange={(checked) => setDeviceSettings(prev => ({
                  ...prev,
                  autoForwardCalls: checked
                }))}
              />
            </div>
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
              <Label className="text-xs">Auto Forward SMS</Label>
              <Switch
                checked={deviceSettings.autoForwardSMS || false}
                onCheckedChange={(checked) => setDeviceSettings(prev => ({
                  ...prev,
                  autoForwardSMS: checked
                }))}
              />
            </div>
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
              <Label className="text-xs">Record Calls</Label>
              <Switch
                checked={deviceSettings.recordCalls || false}
                onCheckedChange={(checked) => setDeviceSettings(prev => ({
                  ...prev,
                  recordCalls: checked
                }))}
              />
            </div>
            <div className="border-t pt-3">
              <Button onClick={saveDeviceSettings} className="w-full text-xs py-2">
                <Save className="mr-2 h-3 w-3" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={showSMSModal}
            variant="outline" 
            className="text-xs"
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            View SMS ({deviceSMS.length})
          </Button>
          <Button 
            onClick={showEntriesModal}
            variant="outline"
            className="text-xs"
          >
            <FileText className="mr-1 h-3 w-3" />
            View Entries ({deviceEntries.length})
          </Button>
        </div>

        {/* SMS Modal */}
        <Dialog open={smsModalOpen} onOpenChange={setSmsModalOpen}>
          <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center text-sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS Messages ({deviceSMS.length})
              </DialogTitle>
              <DialogDescription className="text-xs">
                Device ID: {deviceId} • Latest messages first
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {/* Search Input */}
              <Input
                placeholder="Search messages..."
                onChange={(e) => filterSMS(e.target.value)}
                className="text-sm"
              />
              
              {/* Export Button */}
              <Button 
                onClick={() => exportDeviceData('sms')}
                variant="outline" 
                size="sm"
                className="w-full text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Export CSV
              </Button>
              
              {/* SMS List - Same Design as SMS Page */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredSMS.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No SMS messages found
                  </div>
                ) : (
                  filteredSMS.map((sms) => (
                    <Card key={sms.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        {/* Header with Device ID and Type */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground truncate">
                            {deviceId}
                          </span>
                          <Badge variant={sms.type === 'sent' ? 'default' : 'secondary'} className="text-xs">
                            {sms.type || 'Unknown'}
                          </Badge>
                        </div>
                        
                        {/* Sender and Receiver */}
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <Phone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground mr-1">From:</span>
                            <span className="font-medium truncate">{sms.sender || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Phone className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                            <span className="text-muted-foreground mr-1">To:</span>
                            <span className="font-medium truncate">{sms.receiver || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {/* Message Content */}
                        <div className="border-t pt-2">
                          <div 
                            className="text-xs bg-muted/50 p-2 rounded cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden"
                            onClick={() => alert(`Full Message:\n\n${sms.content || sms.message || 'No message content'}`)}
                            title="Click to view full message"
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                          >
                            <div 
                              className="leading-relaxed"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 30,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {sms.content || sms.message || 'No message content'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Date and Time */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-1">
                          <span>{new Date(sms.timestamp).toLocaleDateString()}</span>
                          <span>{new Date(sms.timestamp).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Entries Modal */}
        <Dialog open={entriesModalOpen} onOpenChange={setEntriesModalOpen}>
          <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4" />
                Call Logs & Entries ({deviceEntries.length})
              </DialogTitle>
              <DialogDescription className="text-xs">
                Device ID: {deviceId} • Latest entries first
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {/* Search Input */}
              <Input
                placeholder="Search entries..."
                onChange={(e) => filterEntries(e.target.value)}
                className="text-sm"
              />
              
              {/* Export Button */}
              <Button 
                onClick={() => exportDeviceData('entries')}
                variant="outline" 
                size="sm"
                className="w-full text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Export CSV
              </Button>
              
              {/* Entries List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No entries found
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <Card key={entry.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={entry.type === 'outgoing' ? 'default' : entry.type === 'incoming' ? 'secondary' : 'destructive'} className="text-xs">
                            {entry.type || 'Unknown'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <Phone className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                            <span className="text-muted-foreground mr-1">Number:</span>
                            <span className="font-medium truncate">{entry.phoneNumber || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground mr-1">Duration:</span>
                            <span className="font-medium">
                              {entry.duration ? `${Math.floor(entry.duration / 60)}:${(entry.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge variant={entry.status === 'answered' ? 'default' : 'secondary'} className="text-xs">
                              {entry.status || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send SMS Modal */}
        <Dialog open={sendSmsModalOpen} onOpenChange={setSendSmsModalOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-sm">
                <Send className="mr-2 h-4 w-4" />
                Send SMS from {device?.device_name || 'Device'}
              </DialogTitle>
              <DialogDescription className="text-xs">
                SIM: {simInfo?.sim_info?.[selectedSIM]?.displayName || 'Unknown'} - {simInfo?.sim_info?.[selectedSIM]?.phoneNumber || 'Unknown'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Recipient Number</Label>
                <Input
                  placeholder="Enter recipient number"
                  value={smsForm.recipient}
                  onChange={(e) => setSmsForm(prev => ({ ...prev, recipient: e.target.value }))}
                  className="text-sm"
                  type="tel"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Message</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type your message..."
                  value={smsForm.message}
                  onChange={(e) => setSmsForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setSendSmsModalOpen(false)}
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendSMS}
                  className="flex-1 text-xs"
                  disabled={!smsForm.recipient || !smsForm.message}
                >
                  <Send className="mr-1 h-3 w-3" />
                  Send SMS
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Call Forwarding Modal */}
        <Dialog open={callForwardingModalOpen} onOpenChange={setCallForwardingModalOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-sm">
                <PhoneForwarded className="mr-2 h-4 w-4" />
                Call Forwarding Settings
              </DialogTitle>
              <DialogDescription className="text-xs">
                SIM: {simInfo?.sim_info?.[selectedSIM]?.displayName || 'Unknown'} - {simInfo?.sim_info?.[selectedSIM]?.phoneNumber || 'Unknown'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Forward to Number</Label>
                <Input
                  placeholder="Enter phone number to forward calls"
                  value={forwardingSettings.forwarding_number}
                  onChange={(e) => setForwardingSettings(prev => ({ 
                    ...prev, 
                    forwarding_number: e.target.value 
                  }))}
                  className="text-sm"
                  type="tel"
                />
              </div>
              
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded">
                <Label className="text-xs">Enable Call Forwarding</Label>
                <Switch
                  checked={forwardingSettings.forwarding_status}
                  onCheckedChange={(checked) => setForwardingSettings(prev => ({
                    ...prev,
                    forwarding_status: checked
                  }))}
                />
              </div>
              
              {forwardingSettings.forwarding_status && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs">
                  <strong>Active:</strong> Calls to {simInfo?.sim_info?.[selectedSIM]?.phoneNumber} will be forwarded to {forwardingSettings.forwarding_number || 'the specified number'}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setCallForwardingModalOpen(false)}
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateCallForwarding(forwardingSettings)}
                  className="flex-1 text-xs"
                >
                  <Save className="mr-1 h-3 w-3" />
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}