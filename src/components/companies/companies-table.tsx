"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail, Calendar, MoreHorizontal, Filter, Building, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CompanyCard } from "./company-card";
import type { CompanyCard as CompanyCardType } from '@/lib/types';
import { cn } from "@/lib/utils";

interface CompanyRow extends CompanyCardType {
  leadScore: number;
  revenueOpportunity: number;
  nextAction: string;
  urgencyLevel: 'high' | 'medium' | 'low';
  contactPerson?: string;
  contactEmail?: string;
  industrySegment: string;
  businessValue: number;
  conversionProbability: number;
}

interface CompaniesTableProps {
  companies: CompanyRow[];
  onCompanySelect?: (companyIds: string[]) => void;
  onCompanyAction?: (companyId: string, action: 'call' | 'email' | 'schedule') => void;
}

type SortField = keyof CompanyRow;
type SortDirection = 'asc' | 'desc';

const urgencyConfig = {
  high: { color: 'bg-red-500', label: '🔴 URGENT', priority: 3 },
  medium: { color: 'bg-orange-500', label: '🟠 MED', priority: 2 },
  low: { color: 'bg-yellow-500', label: '🟡 LOW', priority: 1 }
};

const industryIcons = {
  'technology': '💻',
  'finance': '🏦',
  'healthcare': '🏥',
  'manufacturing': '🏭',
  'retail': '🛍️',
  'real_estate': '🏢',
  'consulting': '📊',
  'legal': '⚖️',
  'energy': '⚡',
  'construction': '🏗️'
};

export function CompaniesTable({ companies, onCompanySelect, onCompanyAction }: CompaniesTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('leadScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [filters, setFilters] = useState({
    urgency: 'all',
    industry: 'all',
    scoreRange: 'all',
    employeeRange: 'all'
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
      setSelectedCompanies(new Set(companies.map(company => company.id)));
    } else {
      setSelectedCompanies(new Set());
    }
    onCompanySelect?.(Array.from(selectedCompanies));
  };

  const handleSelectCompany = (companyId: string, checked: boolean) => {
    const newSelected = new Set(selectedCompanies);
    if (checked) {
      newSelected.add(companyId);
    } else {
      newSelected.delete(companyId);
    }
    setSelectedCompanies(newSelected);
    onCompanySelect?.(Array.from(newSelected));
  };

  const toggleRowExpansion = (companyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedRows(newExpanded);
  };

  const sortedCompanies = [...companies].sort((a, b) => {
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

  const filteredCompanies = sortedCompanies.filter(company => {
    if (filters.urgency !== 'all' && company.urgencyLevel !== filters.urgency) return false;
    if (filters.industry !== 'all' && company.industrySegment !== filters.industry) return false;
    if (filters.scoreRange !== 'all') {
      const [min, max] = filters.scoreRange.split('-').map(Number);
      if (company.leadScore < min || company.leadScore > max) return false;
    }
    if (filters.employeeRange !== 'all') {
      const employees = company.employees || 0;
      const [min, max] = filters.employeeRange.split('-').map(Number);
      if (max) {
        if (employees < min || employees > max) return false;
      } else {
        if (employees < min) return false;
      }
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

  const getIndustryDisplay = (segment: string) => {
    return industryIcons[segment as keyof typeof industryIcons] || '🏢';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      {/* Table Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2 text-green-600" />
            Companies ({filteredCompanies.length})
          </h3>
          {selectedCompanies.size > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{selectedCompanies.size} selected</Badge>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Bulk Contact
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Bulk Proposal
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
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setFilters({...filters, urgency: 'high'})}>
                High Urgency Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, scoreRange: '80-100'})}>
                Top Scores (80-100)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, employeeRange: '50-999'})}>
                Mid-size Companies (50-999)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, industry: 'technology'})}>
                Technology Sector
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({urgency: 'all', industry: 'all', scoreRange: 'all', employeeRange: 'all'})}>
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
                  checked={selectedCompanies.size === companies.length && companies.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3"></th> {/* Expand toggle */}
              <SortableHeader field="leadScore">Score</SortableHeader>
              <SortableHeader field="name">Company</SortableHeader>
              <SortableHeader field="geo_city">Location</SortableHeader>
              <SortableHeader field="employees">Size</SortableHeader>
              <SortableHeader field="industrySegment">Industry</SortableHeader>
              <SortableHeader field="businessValue">Value</SortableHeader>
              <SortableHeader field="nextAction">Next Action</SortableHeader>
              <SortableHeader field="urgencyLevel">Urgency</SortableHeader>
              <SortableHeader field="conversionProbability">Conv. %</SortableHeader>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <>
                <tr 
                  key={company.id} 
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    rowHeight[density],
                    selectedCompanies.has(company.id) && "bg-blue-50"
                  )}
                >
                  {/* Select checkbox */}
                  <td className="px-4 py-2">
                    <Checkbox 
                      checked={selectedCompanies.has(company.id)}
                      onCheckedChange={(checked) => handleSelectCompany(company.id, checked as boolean)}
                    />
                  </td>
                  
                  {/* Expand toggle */}
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(company.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRows.has(company.id) ? 
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
                        company.leadScore >= 90 ? "bg-green-500" :
                        company.leadScore >= 70 ? "bg-yellow-500" :
                        company.leadScore >= 50 ? "bg-orange-500" : "bg-red-500"
                      )}>
                        {company.leadScore}
                      </div>
                    </div>
                  </td>
                  
                  {/* Company Name */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        {company.contactPerson && (
                          <div className="text-xs text-gray-500">
                            Contact: {company.contactPerson}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Location */}
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">{company.geo_city}</div>
                    {company.ateco && (
                      <div className="text-xs text-gray-500">ATECO: {company.ateco}</div>
                    )}
                  </td>
                  
                  {/* Company Size */}
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">
                      {company.employees ? `${company.employees} emp.` : 'N/A'}
                    </div>
                  </td>
                  
                  {/* Industry */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {getIndustryDisplay(company.industrySegment)}
                      </span>
                      <div className="text-sm text-gray-900 capitalize">
                        {company.industrySegment.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  
                  {/* Business Value */}
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-green-600">
                      €{company.businessValue.toLocaleString()}
                    </div>
                  </td>
                  
                  {/* Next Action */}
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">{company.nextAction}</div>
                  </td>
                  
                  {/* Urgency */}
                  <td className="px-4 py-2">
                    <Badge variant="outline" className={cn(
                      "text-white border-0",
                      urgencyConfig[company.urgencyLevel].color
                    )}>
                      {urgencyConfig[company.urgencyLevel].label}
                    </Badge>
                  </td>
                  
                  {/* Conversion Probability */}
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {company.conversionProbability}%
                      </div>
                      <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${company.conversionProbability}%` }}
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
                        onClick={() => onCompanyAction?.(company.id, 'call')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onCompanyAction?.(company.id, 'email')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onCompanyAction?.(company.id, 'schedule')}
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
                          <DropdownMenuItem>Send Proposal</DropdownMenuItem>
                          <DropdownMenuItem>Add to Pipeline</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Presentation</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Qualified</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Detail */}
                {expandedRows.has(company.id) && (
                  <tr>
                    <td colSpan={12} className="px-4 py-4 bg-gray-50">
                      <div className="max-w-4xl">
                        <CompanyCard 
                          company={company}
                          onAddToList={() => console.log('Add to list:', company.id)}
                          onViewSuggestions={() => console.log('View suggestions:', company.id)}
                        />
                        
                        {/* Additional Business Intelligence */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Property Risk</span>
                              <TrendingUp className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-lg font-semibold text-orange-600">
                              {company.scores.opportunity_property !== undefined 
                                ? `${Math.round(company.scores.opportunity_property * 100)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Flood Risk</span>
                              <Shield className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-lg font-semibold text-blue-600">
                              {company.scores.risk_flood !== undefined 
                                ? `${Math.round(company.scores.risk_flood * 100)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Employee Benefits</span>
                              <Building className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              {company.scores.opportunity_employee_benefits !== undefined 
                                ? `${Math.round(company.scores.opportunity_employee_benefits * 100)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Business Continuity</span>
                              <Shield className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="text-lg font-semibold text-purple-600">
                              {company.scores.risk_business_continuity !== undefined 
                                ? `${Math.round(company.scores.risk_business_continuity * 100)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-sm">No companies match the current filters</div>
        </div>
      )}
    </div>
  );
}