"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail, Calendar, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EnhancedPersonCard } from "./enhanced-person-card";
import { PersonCard, type PersonCard as PersonCardType } from "./person-card";
import { cn } from "@/lib/utils";

interface LeadRow extends PersonCardType {
  leadScore: number;
  revenueOpportunity: number;
  nextAction: string;
  urgencyLevel: 'high' | 'medium' | 'low';
  policyInterests: string[];
  lastContact?: Date;
  conversionProbability: number;
}

interface LeadsTableProps {
  leads: LeadRow[];
  onLeadSelect?: (leadIds: string[]) => void;
  onLeadAction?: (leadId: string, action: 'call' | 'email' | 'schedule') => void;
}

type SortField = keyof LeadRow;
type SortDirection = 'asc' | 'desc';

const urgencyConfig = {
  high: { color: 'bg-red-500', label: '🔴 HIGH', priority: 3 },
  medium: { color: 'bg-orange-500', label: '🟠 MED', priority: 2 },
  low: { color: 'bg-yellow-500', label: '🟡 LOW', priority: 1 }
};

const policyIcons = {
  'casa': '🏠',
  'auto': '🚗', 
  'moto': '🏍️',
  'vita': '❤️',
  'salute': '🏥',
  'viaggio': '✈️'
};

export function LeadsTable({ leads, onLeadSelect, onLeadAction }: LeadsTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('leadScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [filters, setFilters] = useState({
    urgency: 'all',
    policyType: 'all',
    scoreRange: 'all'
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
    onLeadSelect?.(Array.from(selectedLeads));
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (checked) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
    onLeadSelect?.(Array.from(newSelected));
  };

  const toggleRowExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedRows(newExpanded);
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'urgencyLevel') {
      aValue = urgencyConfig[a.urgencyLevel].priority;
      bValue = urgencyConfig[b.urgencyLevel].priority;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const filteredLeads = sortedLeads.filter(lead => {
    if (filters.urgency !== 'all' && lead.urgencyLevel !== filters.urgency) return false;
    if (filters.scoreRange !== 'all') {
      const [min, max] = filters.scoreRange.split('-').map(Number);
      if (lead.leadScore < min || lead.leadScore > max) return false;
    }
    return true;
  });

  const rowHeight = {
    compact: 'h-12',
    comfortable: 'h-16', 
    spacious: 'h-20'
  };

  const SortableHeader = ({ field, children, className = "" }: { 
    field: SortField; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <th 
      className={cn(
        "px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      {/* Table Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">
            Leads ({filteredLeads.length})
          </h3>
          {selectedLeads.size > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{selectedLeads.size} selected</Badge>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Bulk Call
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Bulk Email
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilters({...filters, urgency: 'high'})}>
                High Urgency Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, scoreRange: '80-100'})}>
                Top Scores (80-100)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({urgency: 'all', policyType: 'all', scoreRange: 'all'})}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Density
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDensity('compact')}>
                Compact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDensity('comfortable')}>
                Comfortable
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDensity('spacious')}>
                Spacious
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox 
                  checked={selectedLeads.size === leads.length && leads.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3"></th> {/* Expand toggle */}
              <SortableHeader field="leadScore">Score</SortableHeader>
              <SortableHeader field="name">Nome</SortableHeader>
              <SortableHeader field="city">Località</SortableHeader>
              <SortableHeader field="revenueOpportunity">Revenue</SortableHeader>
              <SortableHeader field="nextAction">Next Action</SortableHeader>
              <SortableHeader field="urgencyLevel">Urgency</SortableHeader>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Interests
              </th>
              <SortableHeader field="conversionProbability">Conv. %</SortableHeader>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <>
                <tr 
                  key={lead.id} 
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    rowHeight[density],
                    selectedLeads.has(lead.id) && "bg-blue-50"
                  )}
                >
                  {/* Select checkbox */}
                  <td className="px-4 py-2">
                    <Checkbox 
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                    />
                  </td>
                  
                  {/* Expand toggle */}
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(lead.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRows.has(lead.id) ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </td>
                  
                  {/* Lead Score */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-12 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        lead.leadScore >= 90 ? "bg-green-500" :
                        lead.leadScore >= 70 ? "bg-yellow-500" :
                        lead.leadScore >= 50 ? "bg-orange-500" : "bg-red-500"
                      )}>
                        {lead.leadScore}
                      </div>
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Location */}
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">{lead.city}</div>
                    <div className="text-xs text-gray-500">{lead.region}</div>
                  </td>
                  
                  {/* Revenue Opportunity */}
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-green-600">
                      €{lead.revenueOpportunity.toLocaleString()}
                    </div>
                  </td>
                  
                  {/* Next Action */}
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">{lead.nextAction}</div>
                  </td>
                  
                  {/* Urgency */}
                  <td className="px-4 py-2">
                    <Badge variant="outline" className={cn(
                      "text-white border-0",
                      urgencyConfig[lead.urgencyLevel].color
                    )}>
                      {urgencyConfig[lead.urgencyLevel].label}
                    </Badge>
                  </td>
                  
                  {/* Policy Interests */}
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {lead.policyInterests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="text-lg" title={interest}>
                          {policyIcons[interest as keyof typeof policyIcons] || '📋'}
                        </span>
                      ))}
                      {lead.policyInterests.length > 3 && (
                        <span className="text-xs text-gray-500">+{lead.policyInterests.length - 3}</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Conversion Probability */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.conversionProbability}%
                      </div>
                      <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${lead.conversionProbability}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onLeadAction?.(lead.id, 'call')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onLeadAction?.(lead.id, 'email')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onLeadAction?.(lead.id, 'schedule')}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Add to List</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                          <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Detail */}
                {expandedRows.has(lead.id) && (
                  <tr>
                    <td colSpan={11} className="px-4 py-4 bg-gray-50">
                      <div className="max-w-4xl">
                        <EnhancedPersonCard person={lead} />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-sm">No leads match the current filters</div>
        </div>
      )}
    </div>
  );
}