"use client";
import { useState, useEffect } from "react";
import { ref, onValue, off, remove } from "firebase/database";
import { auth, database } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Search, 
  RefreshCw,
  Calendar,
  Copy,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Auth check
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Load entries
    const entriesRef = ref(database, "entries");
    const entriesListener = onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const entriesData = snapshot.val();
        const entriesArray = Object.keys(entriesData).map(key => {
          const entryData = entriesData[key];
          let timestamp = Date.now(); // Default to current time
          
          // Try to get timestamp from different possible fields
          if (entryData.time) {
            timestamp = typeof entryData.time === 'string' 
              ? new Date(entryData.time).getTime() 
              : entryData.time;
          } else if (entryData.timestamp) {
            timestamp = typeof entryData.timestamp === 'string' 
              ? new Date(entryData.timestamp).getTime() 
              : entryData.timestamp;
          } else if (entryData.date) {
            timestamp = typeof entryData.date === 'string' 
              ? new Date(entryData.date).getTime() 
              : entryData.date;
          }
          
          // Ensure timestamp is valid
          if (isNaN(timestamp)) {
            timestamp = Date.now();
          }
          
          return {
            id: key,
            data: entryData,
            timestamp: timestamp
          };
        }).sort((a, b) => b.timestamp - a.timestamp); // Latest first (descending order)
        
        setEntries(entriesArray);
        setFilteredEntries(entriesArray);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      off(entriesRef, "value", entriesListener);
    };
  }, [router]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = entries.filter(entry => {
        const data = entry.data;
        return Object.entries(data).some(([key, value]) => 
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }).sort((a, b) => b.timestamp - a.timestamp); // Maintain latest first sorting after filter
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [searchTerm, entries]);

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (entry) => {
    const data = entry.data;
    const allText = Object.entries(data)
      .filter(([key]) => key !== 'time' && key !== 'timestamp')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(allText).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const deleteEntry = async (entryId) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await remove(ref(database, `entries/${entryId}`));
        setEntries(prev => prev.filter(entry => entry.id !== entryId));
        setFilteredEntries(prev => prev.filter(entry => entry.id !== entryId));
        alert('Entry deleted successfully!');
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "No Date";
    
    try {
      const date = typeof timestamp === 'string' 
        ? new Date(timestamp) 
        : new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Entries ({filteredEntries.length})
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              System entries and logs (Latest first)
            </p>
          </div>
          <Button onClick={() => router.push('/admin')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-blue-500 dark:border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Entries Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? 'No entries found matching your search' : 'No entries found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEntries.map((entry) => {
              const data = entry.data;
              const isExpanded = expandedCards[entry.id];
              const dataEntries = Object.entries(data).filter(([key]) => key !== 'time' && key !== 'timestamp');
              const visibleEntries = isExpanded ? dataEntries : dataEntries.slice(0, 3);
              
              return (
                <Card 
                  key={entry.id}
                  className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Data Fields */}
                      {visibleEntries.map(([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            {key}
                          </span>
                          <span className="text-sm text-slate-800 dark:text-slate-200 break-words">
                            {value == null || String(value).trim() === '' ? 'No Data Available' : String(value)}
                          </span>
                        </div>
                      ))}
                      
                      {/* Show expand button if more than 3 entries */}
                      {dataEntries.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCard(entry.id)}
                          className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="mr-2 h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Show More ({dataEntries.length - 3} more fields)
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col">
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="mr-1 h-3 w-3 text-blue-500" />
                            <span className="font-medium">{formatDate(entry.timestamp)}</span>
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Entry #{entry.id.slice(-6)}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(entry)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEntry(entry.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}