"use client";

import { useState } from "react";
import { Grid3X3, List, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LeadsTable } from "./leads-table";
import { PersonCard, type PersonCard as PersonCardType } from "./person-card";
import { cn } from "@/lib/utils";

interface LeadData extends PersonCardType {
  leadScore: number;
  revenueOpportunity: number;
  nextAction: string;
  urgencyLevel: 'high' | 'medium' | 'low';
  policyInterests: string[];
  lastContact?: Date;
  conversionProbability: number;
}

interface LeadsViewToggleProps {
  leads: LeadData[];
  onLeadSelect?: (leadIds: string[]) => void;
  onLeadAction?: (leadId: string, action: 'call' | 'email' | 'schedule') => void;
}

type ViewType = 'table' | 'grid';
type GridSize = 'small' | 'medium' | 'large';

export function LeadsViewToggle({ 
  leads, 
  onLeadSelect, 
  onLeadAction 
}: LeadsViewToggleProps) {
  const [viewType, setViewType] = useState<ViewType>('table');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const handleLeadSelection = (leadIds: string[]) => {
    setSelectedLeads(leadIds);
    onLeadSelect?.(leadIds);
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

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <Badge variant="secondary" className="text-sm">
            {leads.length} total
          </Badge>
          {selectedLeads.length > 0 && (
            <Badge variant="default" className="text-sm">
              {selectedLeads.length} selected
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

      {/* Content Area */}
      <div className="min-h-[600px]">
        {viewType === 'table' ? (
          <LeadsTable 
            leads={leads}
            onLeadSelect={handleLeadSelection}
            onLeadAction={onLeadAction}
          />
        ) : (
          <div className="space-y-4">
            {/* Grid Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Grid view • {gridSize} cards • {leads.length} leads
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Sort by Score
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className={cn(
              "grid",
              gridColumns[gridSize],
              gridGap[gridSize]
            )}>
              {leads
                .sort((a, b) => b.leadScore - a.leadScore)
                .map((lead) => (
                <div 
                  key={lead.id}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    selectedLeads.includes(lead.id) && "ring-2 ring-blue-500"
                  )}
                >
                  <PersonCard 
                    person={lead}
                    className={cn(
                      "h-full cursor-pointer",
                      gridSize === 'small' && "text-sm",
                      gridSize === 'large' && "p-6"
                    )}
                    onClick={() => {
                      const newSelected = selectedLeads.includes(lead.id)
                        ? selectedLeads.filter(id => id !== lead.id)
                        : [...selectedLeads, lead.id];
                      handleLeadSelection(newSelected);
                    }}
                  />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadAction?.(lead.id, 'call');
                        }}
                      >
                        📞
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadAction?.(lead.id, 'email');
                        }}
                      >
                        ✉️
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Stats */}
            <div className="flex items-center justify-center p-4 text-sm text-gray-500 border-t">
              <div className="flex items-center space-x-6">
                <span>
                  High Priority: {leads.filter(l => l.urgencyLevel === 'high').length}
                </span>
                <span>
                  Avg Score: {Math.round(leads.reduce((acc, l) => acc + l.leadScore, 0) / leads.length)}
                </span>
                <span>
                  Total Revenue: €{leads.reduce((acc, l) => acc + l.revenueOpportunity, 0).toLocaleString()}
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
          {selectedLeads.length > 0 && (
            <span className="text-blue-600">
              {selectedLeads.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-gray-500">
          <span>
            Avg Score: <strong>{Math.round(leads.reduce((acc, l) => acc + l.leadScore, 0) / leads.length)}</strong>
          </span>
          <span>
            High Priority: <strong>{leads.filter(l => l.urgencyLevel === 'high').length}</strong>
          </span>
          <span>
            Est. Revenue: <strong>€{leads.reduce((acc, l) => acc + l.revenueOpportunity, 0).toLocaleString()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}