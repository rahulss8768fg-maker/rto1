"use client";
import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { auth, database } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Search, 
  Download,
  RefreshCw,
  Eye,
  Phone,
  ArrowLeft
} from "lucide-react";

export default function SMSPage() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Auth check
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Load SMS
    const smsRef = ref(database, "sms");
    const smsListener = onValue(smsRef, (snapshot) => {
      if (snapshot.exists()) {
        const smsData = snapshot.val();
        const smsArray = Object.keys(smsData).map(key => {
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
        }).sort((a, b) => b.timestamp - a.timestamp); // Latest first (descending order)
        
        setMessages(smsArray);
        setFilteredMessages(smsArray);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      off(smsRef, "value", smsListener);
    };
  }, [router]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter(message => 
        message.sender?.includes(searchTerm) ||
        message.receiver?.includes(searchTerm) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.deviceId?.includes(searchTerm)
      ).sort((a, b) => b.timestamp - a.timestamp); // Maintain latest first sorting after filter
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const exportData = () => {
    const csvContent = [
      ['Device ID', 'Sender', 'Receiver', 'Message', 'Date', 'Time'].join(','),
      ...filteredMessages.map(message => [
        message.deviceId || '',
        message.sender || '',
        message.receiver || '',
        `"${message.content || ''}"`,
        new Date(message.timestamp).toLocaleDateString(),
        new Date(message.timestamp).toLocaleTimeString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sms-messages.csv';
    a.click();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return 'N/A';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto space-y-4 p-3">

        {/* Search - Mobile Optimized */}
        <Card className="p-3">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="flex items-center text-sm">
              <Search className="mr-2 h-4 w-4" />
              Search Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm"
            />
          </CardContent>
        </Card>

        {/* SMS Messages - Mobile Grid */}
        <Card className="p-3">
          <CardHeader className="pb-3 px-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  SMS Messages ({filteredMessages.length})
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Latest messages first
                </CardDescription>
              </div>
              <Button onClick={() => router.push('/admin')} variant="outline" size="sm">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button onClick={exportData} variant="outline" size="sm" className="text-xs flex-1">
                <Download className="mr-1 h-3 w-3" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No messages found matching your search' : 'No messages found'}
              </div>
            ) : (
              /* Mobile Grid Layout - Single Column */
              <div className="grid gap-3">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className="p-3 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      {/* Header with Device ID and Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground truncate">
                          {message.deviceId || 'Unknown Device'}
                        </span>
                        <Badge variant={message.type === 'sent' ? 'default' : 'secondary'} className="text-xs">
                          {message.type || 'Unknown'}
                        </Badge>
                      </div>
                      
                      {/* Sender and Receiver */}
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Phone className="mr-1 h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-muted-foreground mr-1">From:</span>
                          <span className="font-medium truncate">{message.sender || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Phone className="mr-1 h-3 w-3 text-blue-600 flex-shrink-0" />
                          <span className="text-muted-foreground mr-1">To:</span>
                          <span className="font-medium truncate">{message.receiver || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {/* Message Content */}
                      <div className="border-t pt-2">
                        <div 
                          className="text-xs bg-muted/50 p-2 rounded cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden"
                          onClick={() => alert(`Full Message:\n\n${message.content || 'No message content'}`)}
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
                            {message.content || 'No message content'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Date and Time */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-1">
                        <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                        <span>{new Date(message.timestamp).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}