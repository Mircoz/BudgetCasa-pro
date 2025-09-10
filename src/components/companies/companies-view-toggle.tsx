"use client";

import { useState } from "react";
import { Grid3X3, List, Settings, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CompaniesTable } from "./companies-table";
import { CompanyCard } from "./company-card";
import type { CompanyCard as CompanyCardType } from '@/lib/types';
import { cn } from "@/lib/utils";

interface CompanyData extends CompanyCardType {
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

interface CompaniesViewToggleProps {
  companies: CompanyData[];
  onCompanySelect?: (companyIds: string[]) => void;
  onCompanyAction?: (companyId: string, action: 'call' | 'email' | 'schedule') => void;
}

type ViewType = 'table' | 'grid';
type GridSize = 'small' | 'medium' | 'large';

export function CompaniesViewToggle({ 
  companies, 
  onCompanySelect, 
  onCompanyAction 
}: CompaniesViewToggleProps) {
  const [viewType, setViewType] = useState<ViewType>('table');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const handleCompanySelection = (companyIds: string[]) => {
    setSelectedCompanies(companyIds);
    onCompanySelect?.(companyIds);
  };

  const gridColumns = {
    small: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    medium: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    large: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  const gridGap = {
    small: 'gap-3',
    medium: 'gap-4', 
    large: 'gap-6'
  };

  // Calculate aggregate metrics
  const totalValue = companies.reduce((acc, company) => acc + company.businessValue, 0);
  const avgScore = Math.round(companies.reduce((acc, company) => acc + company.leadScore, 0) / companies.length);
  const highPriorityCount = companies.filter(company => company.urgencyLevel === 'high').length;
  const totalEmployees = companies.reduce((acc, company) => acc + (company.employees || 0), 0);

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="h-6 w-6 mr-2 text-green-600" />
            Companies
          </h2>
          <Badge variant="secondary" className="text-sm">
            {companies.length} total
          </Badge>
          {selectedCompanies.length > 0 && (
            <Badge variant="default" className="text-sm">
              {selectedCompanies.length} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View Type Toggle */}
          <div className="flex items-center rounded-md border border-gray-200 p-1">
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('table')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Cards
            </Button>
          </div>

          {/* Grid Settings (only show in grid view) */}
          {viewType === 'grid' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Grid Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => setGridSize('small')}
                  className={cn(gridSize === 'small' && "bg-accent")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Compact Cards</span>
                    {gridSize === 'small' && <Badge variant="secondary">Active</Badge>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setGridSize('medium')}
                  className={cn(gridSize === 'medium' && "bg-accent")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Medium Cards</span>
                    {gridSize === 'medium' && <Badge variant="secondary">Active</Badge>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setGridSize('large')}
                  className={cn(gridSize === 'large' && "bg-accent")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Large Cards</span>
                    {gridSize === 'large' && <Badge variant="secondary">Active</Badge>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-sm text-gray-500">
                    {viewType === 'grid' ? 
                      `Showing ${gridColumns[gridSize].split(' ').pop()?.replace('xl:grid-cols-', '')} per row` :
                      'Table view active'
                    }
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-700">
              €{(totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-green-600">Total Pipeline Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700">
              {avgScore}
            </div>
            <div className="text-sm text-blue-600">Average Lead Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">
              {highPriorityCount}
            </div>
            <div className="text-sm text-red-600">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {totalEmployees.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {viewType === 'table' ? (
          <CompaniesTable 
            companies={companies}
            onCompanySelect={handleCompanySelection}
            onCompanyAction={onCompanyAction}
          />
        ) : (
          <div className="space-y-4">
            {/* Grid Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Grid view • {gridSize} cards • {companies.length} companies
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Sort by Score
                </Button>
                <Button variant="outline" size="sm">
                  Sort by Value
                </Button>
                <Button variant="outline" size="sm">
                  Filter Industry
                </Button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className={cn(
              "grid",
              gridColumns[gridSize],
              gridGap[gridSize]
            )}>
              {companies
                .sort((a, b) => b.leadScore - a.leadScore)
                .map((company) => (
                <div 
                  key={company.id}
                  className={cn(
                    "relative group transition-all duration-200 hover:scale-105",
                    selectedCompanies.includes(company.id) && "ring-2 ring-green-500"
                  )}
                >
                  <CompanyCard 
                    company={company}
                    onAddToList={() => {
                      const newSelected = selectedCompanies.includes(company.id)
                        ? selectedCompanies.filter(id => id !== company.id)
                        : [...selectedCompanies, company.id];
                      handleCompanySelection(newSelected);
                    }}
                    onViewSuggestions={() => console.log('View suggestions for:', company.name)}
                  />
                  
                  {/* Enhanced Info Overlay */}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-bold",
                        company.leadScore >= 90 ? "bg-green-100 text-green-800 border-green-300" :
                        company.leadScore >= 70 ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                        company.leadScore >= 50 ? "bg-orange-100 text-orange-800 border-orange-300" : 
                        "bg-red-100 text-red-800 border-red-300"
                      )}
                    >
                      {company.leadScore}
                    </Badge>
                  </div>
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompanyAction?.(company.id, 'call');
                        }}
                      >
                        📞
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompanyAction?.(company.id, 'email');
                        }}
                      >
                        ✉️
                      </Button>
                    </div>
                  </div>
                  
                  {/* Business Value Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      €{(company.businessValue / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Stats */}
            <div className="flex items-center justify-center p-4 text-sm text-gray-500 border-t">
              <div className="flex items-center space-x-6">
                <span>
                  High Value (€100K+): {companies.filter(c => c.businessValue >= 100000).length}
                </span>
                <span>
                  Technology Sector: {companies.filter(c => c.industrySegment === 'technology').length}
                </span>
                <span>
                  Large Companies (500+ emp): {companies.filter(c => (c.employees || 0) >= 500).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Statistics */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            View: <strong>{viewType === 'table' ? 'Table' : `Grid (${gridSize})`}</strong>
          </span>
          {selectedCompanies.length > 0 && (
            <span className="text-green-600">
              {selectedCompanies.length} companies selected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-gray-500">
          <span>
            Avg Score: <strong>{avgScore}</strong>
          </span>
          <span>
            Pipeline Value: <strong>€{(totalValue / 1000000).toFixed(1)}M</strong>
          </span>
          <span>
            High Priority: <strong>{highPriorityCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}