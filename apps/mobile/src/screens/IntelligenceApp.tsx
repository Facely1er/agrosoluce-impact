/**
 * AgroSoluce Intelligence Mobile App - Professional Three-Tier Interface
 * 
 * Field Intelligence & Operations Platform
 * 
 * Three User Profiles:
 * 1. ERMITS Team Command Center - Monitoring and oversight
 * 2. Cooperative Management Dashboard - Operations and compliance
 * 3. Farmer Field App - Field data collection and access
 */

import { useState } from 'react';
import {
  Target,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText,
  BookOpen,
  MessageSquare,
  Calendar,
  MapPin,
  Activity,
  ClipboardList,
  Sprout,
  UserCheck,
  GraduationCap,
  DollarSign,
  Home,
  Phone,
  Video,
  Globe,
  ChevronRight,
  Plus,
  Eye,
  Clock,
} from 'lucide-react';
import './IntelligenceApp.css';

type UserRole = 'ermits_team' | 'cooperative' | 'farmer' | null;

// Role Selector Component
const RoleSelector = ({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) => (
  <div className="role-selector">
    <div className="role-selector-content">
      <div className="role-selector-header">
        <h1 className="role-selector-title">AgroSoluce Intelligence</h1>
        <p className="role-selector-subtitle">Field Operations Platform</p>
      </div>
      
      <div className="role-buttons">
        <button 
          className="role-button role-button-ermits"
          onClick={() => onSelectRole('ermits_team')}
        >
          <div className="role-button-icon-wrapper">
            <Target className="role-button-icon" />
          </div>
          <div className="role-button-content">
            <h3 className="role-button-title">ERMITS Team</h3>
            <p className="role-button-desc">Command Center • Monitor 3,797+ cooperatives • Compliance oversight</p>
          </div>
          <ChevronRight className="role-button-arrow" />
        </button>

        <button 
          className="role-button role-button-coop"
          onClick={() => onSelectRole('cooperative')}
        >
          <div className="role-button-icon-wrapper">
            <Building2 className="role-button-icon" />
          </div>
          <div className="role-button-content">
            <h3 className="role-button-title">Cooperative Manager</h3>
            <p className="role-button-desc">Operations Dashboard • Member management • Compliance tracking</p>
          </div>
          <ChevronRight className="role-button-arrow" />
        </button>

        <button 
          className="role-button role-button-farmer"
          onClick={() => onSelectRole('farmer')}
        >
          <div className="role-button-icon-wrapper">
            <Users className="role-button-icon" />
          </div>
          <div className="role-button-content">
            <h3 className="role-button-title">Farmer</h3>
            <p className="role-button-desc">Field App • Data collection • Training access • Offline capable</p>
          </div>
          <ChevronRight className="role-button-arrow" />
        </button>
      </div>
    </div>
  </div>
);

// ERMITS Team Dashboard
const ERMITSTeamDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cooperatives' | 'compliance' | 'alerts'>('overview');
  
  return (
    <div className="dashboard-container">
      <header className="header-ermits">
        <div className="header-content">
          <h1 className="header-title">ERMITS Command Center</h1>
          <p className="header-subtitle">Monitoring 3,797 Cooperatives</p>
        </div>
        <div className="header-badge">
          <Activity className="header-badge-icon" />
          <span>Live</span>
        </div>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab ${selectedTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          <BarChart3 className="tab-icon" />
          <span>Overview</span>
        </button>
        <button
          className={`tab ${selectedTab === 'cooperatives' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('cooperatives')}
        >
          <Building2 className="tab-icon" />
          <span>Cooperatives</span>
        </button>
        <button
          className={`tab ${selectedTab === 'compliance' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('compliance')}
        >
          <Shield className="tab-icon" />
          <span>Compliance</span>
        </button>
        <button
          className={`tab ${selectedTab === 'alerts' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('alerts')}
        >
          <AlertTriangle className="tab-icon" />
          <span>Alerts</span>
        </button>
      </nav>

      <main className="dashboard-content">
        {selectedTab === 'overview' && (
          <div className="overview-content">
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-header">
                  <Building2 className="metric-icon" />
                  <span className="metric-label">Active Cooperatives</span>
                </div>
                <div className="metric-value">3,797</div>
                <div className="metric-trend trend-up">+12 this week</div>
              </div>
              
              <div className="metric-card metric-success">
                <div className="metric-header">
                  <Users className="metric-icon" />
                  <span className="metric-label">Total Farmers</span>
                </div>
                <div className="metric-value">524,203</div>
                <div className="metric-trend trend-up">+1,847 this month</div>
              </div>
              
              <div className="metric-card metric-info">
                <div className="metric-header">
                  <CheckCircle2 className="metric-icon" />
                  <span className="metric-label">Documentation Ready</span>
                </div>
                <div className="metric-value">98.2%</div>
                <div className="metric-trend trend-up">+2.1% this month</div>
              </div>
              
              <div className="metric-card metric-warning">
                <div className="metric-header">
                  <AlertTriangle className="metric-icon" />
                  <span className="metric-label">Action Required</span>
                </div>
                <div className="metric-value">127</div>
                <div className="metric-trend">23 urgent</div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BarChart3 className="section-title-icon" />
                System Overview
              </h3>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="overview-stat-label">Child Labor Assessments</span>
                  <span className="overview-stat-value">2,341</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Farmers First Coverage</span>
                  <span className="overview-stat-value">87.3%</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Active Remediations</span>
                  <span className="overview-stat-value">45</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'cooperatives' && (
          <div className="list-content">
            <div className="section-header">
              <h3 className="section-title">Cooperative Directory</h3>
              <button className="btn-icon" aria-label="Add new cooperative" title="Add new cooperative">
                <Plus className="icon-sm" />
              </button>
            </div>
            <div className="cooperative-list">
              {[
                { id: '1', name: 'SCAC Abidjan', region: 'Lagunes', members: 487, status: 'compliant', score: 92 },
                { id: '2', name: 'COOPAGRI San-Pedro', region: 'Bas-Sassandra', members: 1203, status: 'warning', score: 68 },
                { id: '3', name: 'UCODEC Daloa', region: 'Sassandra-Marahoué', members: 856, status: 'compliant', score: 88 },
              ].map((coop) => (
                <div key={coop.id} className="coop-card">
                  <div className="coop-header">
                    <div className="coop-info">
                      <h4 className="coop-name">{coop.name}</h4>
                      <div className="coop-meta">
                        <MapPin className="icon-xs" />
                        <span>{coop.region}</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${coop.status}`}>
                      {coop.status === 'compliant' ? <CheckCircle2 className="icon-xs" /> : <AlertTriangle className="icon-xs" />}
                      <span>{coop.status === 'compliant' ? 'Compliant' : 'Action Needed'}</span>
                    </div>
                  </div>
                  <div className="coop-stats">
                    <div className="coop-stat">
                      <Users className="icon-xs" />
                      <span>{coop.members} members</span>
                    </div>
                    <div className="coop-stat">
                      <BarChart3 className="icon-xs" />
                      <span>Score: {coop.score}%</span>
                    </div>
                  </div>
                  <button className="coop-action">
                    <span>View Details</span>
                    <ChevronRight className="icon-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="compliance-content">
            <div className="section-card">
              <h3 className="section-title">
                <Shield className="section-title-icon" />
                Child Labor Monitoring
              </h3>
              <div className="compliance-metrics">
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Assessments Completed</span>
                    <CheckCircle2 className="icon-sm text-success" />
                  </div>
                  <div className="compliance-metric-value">2,341</div>
                  <div className="compliance-metric-subtitle">of 3,797 cooperatives</div>
                </div>
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Active Violations</span>
                    <AlertTriangle className="icon-sm text-warning" />
                  </div>
                  <div className="compliance-metric-value">23</div>
                  <div className="compliance-metric-subtitle">Requiring immediate action</div>
                </div>
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Remediation Actions</span>
                    <Activity className="icon-sm text-info" />
                  </div>
                  <div className="compliance-metric-value">45</div>
                  <div className="compliance-metric-subtitle">In progress</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <TrendingUp className="section-title-icon" />
                Recent Assessments
              </h3>
              <div className="assessment-list">
                {[
                  { cooperative: 'SCAC Abidjan', date: '2024-12-10', score: 92, violations: 0 },
                  { cooperative: 'COOPAGRI San-Pedro', date: '2024-12-08', score: 68, violations: 2 },
                  { cooperative: 'UCODEC Daloa', date: '2024-12-05', score: 88, violations: 0 },
                ].map((assessment, idx) => (
                  <div key={idx} className="assessment-item">
                    <div className="assessment-info">
                      <h4 className="assessment-coop">{assessment.cooperative}</h4>
                      <div className="assessment-meta">
                        <Calendar className="icon-xs" />
                        <span>{new Date(assessment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="assessment-scores">
                      <div className="score-badge score-good">
                        <span>{assessment.score}%</span>
                      </div>
                      {assessment.violations > 0 && (
                        <div className="violation-badge">
                          <AlertTriangle className="icon-xs" />
                          <span>{assessment.violations}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'alerts' && (
          <div className="alerts-content">
            <div className="section-header">
              <h3 className="section-title">Compliance Alerts</h3>
              <button className="btn-icon" aria-label="Add new alert" title="Add new alert">
                <Plus className="icon-sm" />
              </button>
            </div>
            <div className="alert-list">
              {[
                { type: 'EUDR', priority: 'high', cooperative: 'SCAC Abidjan', message: 'GPS verification required for 23 farms', date: '2 hours ago' },
                { type: 'Child Labor', priority: 'medium', cooperative: 'COOPAGRI San-Pedro', message: 'School enrollment documents pending', date: '5 hours ago' },
                { type: 'Assessment', priority: 'low', cooperative: 'UCODEC Daloa', message: 'Annual assessment scheduled Dec 15', date: '1 day ago' },
              ].map((alert, idx) => (
                <div key={idx} className={`alert-card alert-${alert.priority}`}>
                  <div className="alert-header">
                    <div className="alert-type-badge">
                      <Shield className="icon-xs" />
                      <span>{alert.type}</span>
                    </div>
                    <span className="alert-priority">{alert.priority}</span>
                  </div>
                  <h4 className="alert-coop">{alert.cooperative}</h4>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-footer">
                    <Clock className="icon-xs" />
                    <span>{alert.date}</span>
                    <button className="alert-action">Take Action</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Cooperative Dashboard
const CooperativeDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'members' | 'farmers-first' | 'child-labor' | 'compliance'>('dashboard');
  
  return (
    <div className="dashboard-container">
      <header className="header-coop">
        <div className="header-content">
          <h1 className="header-title">SCAC Abidjan</h1>
          <p className="header-subtitle">487 Members • Lagunes Region</p>
        </div>
        <div className="header-badge badge-success">
          <CheckCircle2 className="header-badge-icon" />
          <span>Compliant</span>
        </div>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab ${selectedTab === 'dashboard' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('dashboard')}
        >
          <BarChart3 className="tab-icon" />
          <span>Dashboard</span>
        </button>
        <button
          className={`tab ${selectedTab === 'members' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('members')}
        >
          <Users className="tab-icon" />
          <span>Members</span>
        </button>
        <button
          className={`tab ${selectedTab === 'farmers-first' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('farmers-first')}
        >
          <Sprout className="tab-icon" />
          <span>Farmers First</span>
        </button>
        <button
          className={`tab ${selectedTab === 'child-labor' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('child-labor')}
        >
          <Shield className="tab-icon" />
          <span>Child Labor</span>
        </button>
        <button
          className={`tab ${selectedTab === 'compliance' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('compliance')}
        >
          <FileText className="tab-icon" />
          <span>Compliance</span>
        </button>
      </nav>

      <main className="dashboard-content">
        {selectedTab === 'dashboard' && (
          <div className="overview-content">
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-header">
                  <DollarSign className="metric-icon" />
                  <span className="metric-label">Monthly Revenue</span>
                </div>
                <div className="metric-value">€127,500</div>
                <div className="metric-trend trend-up">+18% vs last month</div>
              </div>
              
              <div className="metric-card metric-success">
                <div className="metric-header">
                  <Users className="metric-icon" />
                  <span className="metric-label">Active Members</span>
                </div>
                <div className="metric-value">487</div>
                <div className="metric-trend trend-up">+12 this month</div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Quick Actions
              </h3>
              <div className="action-grid">
                <button className="action-card">
                  <FileText className="action-icon" />
                  <span className="action-label">Submit Report</span>
                </button>
                <button className="action-card">
                  <MapPin className="action-icon" />
                  <span className="action-label">Update GPS</span>
                </button>
                <button className="action-card">
                  <MessageSquare className="action-icon" />
                  <span className="action-label">Contact ERMITS</span>
                </button>
                <button className="action-card">
                  <Plus className="action-icon" />
                  <span className="action-label">New Assessment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'members' && (
          <div className="list-content">
            <div className="section-header">
              <h3 className="section-title">Member Directory</h3>
              <button className="btn-primary">
                <Plus className="icon-sm" />
                <span>Add Member</span>
              </button>
            </div>
            <div className="search-bar">
              <input type="search" className="search-input" placeholder="Search members..." />
            </div>
            <div className="member-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="member-card">
                  <div className="member-avatar">
                    <Users className="icon-md" />
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Farmer {i}</h4>
                    <p className="member-details">Plot {i} • 2.3 hectares • Cocoa</p>
                  </div>
                  <button className="member-action" aria-label="View member details" title="View member details">
                    <Eye className="icon-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'farmers-first' && (
          <div className="farmers-first-content">
            <div className="section-card">
              <h3 className="section-title">
                <Sprout className="section-title-icon" />
                Farmers First Overview
              </h3>
              <div className="metrics-grid">
                <div className="metric-card metric-success">
                  <div className="metric-header">
                    <UserCheck className="metric-icon" />
                    <span className="metric-label">Onboarding Coverage</span>
                  </div>
                  <div className="metric-value">87%</div>
                  <div className="metric-trend">425 / 487 farmers</div>
                </div>
                
                <div className="metric-card metric-info">
                  <div className="metric-header">
                    <CheckCircle2 className="metric-icon" />
                    <span className="metric-label">Declarations</span>
                  </div>
                  <div className="metric-value">78%</div>
                  <div className="metric-trend">380 / 487 farmers</div>
                </div>
                
                <div className="metric-card metric-primary">
                  <div className="metric-header">
                    <GraduationCap className="metric-icon" />
                    <span className="metric-label">Training Coverage</span>
                  </div>
                  <div className="metric-value">65%</div>
                  <div className="metric-trend">317 / 487 farmers</div>
                </div>
                
                <div className="metric-card metric-warning">
                  <div className="metric-header">
                    <TrendingUp className="metric-icon" />
                    <span className="metric-label">Impact Tracking</span>
                  </div>
                  <div className="metric-value">42</div>
                  <div className="metric-trend">Data points</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Training Programs
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming Practices', participants: 245, status: 'active' },
                  { title: 'Child Labor Prevention', participants: 180, status: 'active' },
                  { title: 'Financial Literacy', participants: 92, status: 'completed' },
                ].map((training, idx) => (
                  <div key={idx} className="training-item">
                    <div className="training-info">
                      <h4 className="training-title">{training.title}</h4>
                      <div className="training-meta">
                        <Users className="icon-xs" />
                        <span>{training.participants} participants</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${training.status}`}>
                      {training.status === 'active' ? <Activity className="icon-xs" /> : <CheckCircle2 className="icon-xs" />}
                      <span>{training.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BarChart3 className="section-title-icon" />
                Impact Metrics
              </h3>
              <div className="impact-metrics">
                <div className="impact-metric">
                  <div className="impact-metric-label">Children in School</div>
                  <div className="impact-metric-value">681</div>
                </div>
                <div className="impact-metric">
                  <div className="impact-metric-label">Youth Jobs Created</div>
                  <div className="impact-metric-value">22</div>
                </div>
                <div className="impact-metric">
                  <div className="impact-metric-label">Economic Impact</div>
                  <div className="impact-metric-value">€2.78M</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'child-labor' && (
          <div className="child-labor-content">
            <div className="section-card">
              <h3 className="section-title">
                <Shield className="section-title-icon" />
                Child Labor Protection Status
              </h3>
              <div className="compliance-status-grid">
                <div className="status-card status-good">
                  <CheckCircle2 className="status-icon" />
                  <div className="status-content">
                    <h4 className="status-title">Assessment Score</h4>
                    <div className="status-value">92%</div>
                    <p className="status-subtitle">Last assessment: Dec 10, 2024</p>
                  </div>
                </div>
                
                <div className="status-card status-good">
                  <GraduationCap className="status-icon" />
                  <div className="status-content">
                    <h4 className="status-title">School Enrollment</h4>
                    <div className="status-value">94.2%</div>
                    <p className="status-subtitle">681 children enrolled</p>
                  </div>
                </div>
                
                <div className="status-card status-excellent">
                  <CheckCircle2 className="status-icon" />
                  <div className="status-content">
                    <h4 className="status-title">Violations</h4>
                    <div className="status-value">0</div>
                    <p className="status-subtitle">No violations detected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">
                  <ClipboardList className="section-title-icon" />
                  Recent Assessments
                </h3>
                <button className="btn-primary">
                  <Plus className="icon-sm" />
                  <span>New Assessment</span>
                </button>
              </div>
              <div className="assessment-list">
                {[
                  { date: '2024-12-10', assessor: 'Field Officer A', score: 92, violations: 0, children: 681 },
                  { date: '2024-11-15', assessor: 'Field Officer B', score: 89, violations: 0, children: 675 },
                  { date: '2024-10-20', assessor: 'Field Officer A', score: 87, violations: 1, children: 670 },
                ].map((assessment, idx) => (
                  <div key={idx} className="assessment-item">
                    <div className="assessment-info">
                      <h4 className="assessment-date">{new Date(assessment.date).toLocaleDateString()}</h4>
                      <p className="assessment-assessor">Assessed by {assessment.assessor}</p>
                      <div className="assessment-details">
                        <div className="assessment-detail">
                          <BarChart3 className="icon-xs" />
                          <span>Score: {assessment.score}%</span>
                        </div>
                        <div className="assessment-detail">
                          <Users className="icon-xs" />
                          <span>{assessment.children} children</span>
                        </div>
                      </div>
                    </div>
                    <div className="assessment-actions">
                      {assessment.violations > 0 ? (
                        <div className="violation-badge">
                          <AlertTriangle className="icon-xs" />
                          <span>{assessment.violations} violation</span>
                        </div>
                      ) : (
                        <div className="status-badge status-compliant">
                          <CheckCircle2 className="icon-xs" />
                          <span>Clean</span>
                        </div>
                      )}
                      <button className="btn-icon" aria-label="View assessment details" title="View assessment details">
                        <Eye className="icon-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Remediation Actions
              </h3>
              <div className="remediation-list">
                {[
                  { action: 'School Enrollment Support', status: 'completed', beneficiaries: 45, date: '2024-11-30' },
                  { action: 'Family Income Support', status: 'in_progress', beneficiaries: 12, date: '2024-12-01' },
                  { action: 'Awareness Training', status: 'pending', beneficiaries: 180, date: '2024-12-15' },
                ].map((remediation, idx) => (
                  <div key={idx} className="remediation-item">
                    <div className="remediation-info">
                      <h4 className="remediation-title">{remediation.action}</h4>
                      <div className="remediation-meta">
                        <Users className="icon-xs" />
                        <span>{remediation.beneficiaries} beneficiaries</span>
                        <span className="remediation-separator">•</span>
                        <Calendar className="icon-xs" />
                        <span>{new Date(remediation.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${remediation.status}`}>
                      {remediation.status === 'completed' ? <CheckCircle2 className="icon-xs" /> : 
                       remediation.status === 'in_progress' ? <Activity className="icon-xs" /> : 
                       <Clock className="icon-xs" />}
                      <span>{remediation.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="compliance-content">
            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                Compliance Status
              </h3>
              <div className="compliance-list">
                <div className="compliance-item">
                  <div className="compliance-item-header">
                    <span className="compliance-item-label">EUDR Certification</span>
                    <CheckCircle2 className="icon-sm text-success" />
                  </div>
                  <span className="compliance-item-status">Valid</span>
                </div>
                <div className="compliance-item">
                  <div className="compliance-item-header">
                    <span className="compliance-item-label">Fair Trade</span>
                    <CheckCircle2 className="icon-sm text-success" />
                  </div>
                  <span className="compliance-item-status">Valid</span>
                </div>
                <div className="compliance-item">
                  <div className="compliance-item-header">
                    <span className="compliance-item-label">Child Labor Verification</span>
                    <AlertTriangle className="icon-sm text-warning" />
                  </div>
                  <span className="compliance-item-status">Update Required</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Farmer Field App
const FarmerFieldApp = () => {
  const [selectedTab, setSelectedTab] = useState<'home' | 'training' | 'declarations' | 'help'>('home');
  const [language, setLanguage] = useState('baoule');
  
  return (
    <div className="dashboard-container">
      <header className="header-farmer">
        <div className="header-content">
          <h1 className="header-title">AgroSoluce</h1>
          <p className="header-subtitle">Field Operations • Offline Mode</p>
        </div>
        <button className="header-action-btn" aria-label="Change language" title="Change language">
          <Globe className="icon-md" />
        </button>
      </header>

      <nav className="farmer-nav">
        <button
          className={`farmer-tab ${selectedTab === 'home' ? 'farmer-tab-active' : ''}`}
          onClick={() => setSelectedTab('home')}
        >
          <Home className="farmer-tab-icon" />
          <span className="farmer-tab-label">Home</span>
        </button>
        <button
          className={`farmer-tab ${selectedTab === 'training' ? 'farmer-tab-active' : ''}`}
          onClick={() => setSelectedTab('training')}
        >
          <BookOpen className="farmer-tab-icon" />
          <span className="farmer-tab-label">Training</span>
        </button>
        <button
          className={`farmer-tab ${selectedTab === 'declarations' ? 'farmer-tab-active' : ''}`}
          onClick={() => setSelectedTab('declarations')}
        >
          <FileText className="farmer-tab-icon" />
          <span className="farmer-tab-label">Declarations</span>
        </button>
        <button
          className={`farmer-tab ${selectedTab === 'help' ? 'farmer-tab-active' : ''}`}
          onClick={() => setSelectedTab('help')}
        >
          <Phone className="farmer-tab-icon" />
          <span className="farmer-tab-label">Help</span>
        </button>
      </nav>

      <main className="dashboard-content">
        {selectedTab === 'home' && (
          <div className="farmer-home-content">
            <div className="welcome-card">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Track your progress and access resources</p>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Your Status
              </h3>
              <div className="farmer-stats">
                <div className="farmer-stat">
                  <div className="farmer-stat-icon">
                    <Sprout className="icon-md" />
                  </div>
                  <div className="farmer-stat-content">
                    <div className="farmer-stat-label">Farm Size</div>
                    <div className="farmer-stat-value">2.3 ha</div>
                  </div>
                </div>
                <div className="farmer-stat">
                  <div className="farmer-stat-icon">
                    <CheckCircle2 className="icon-md" />
                  </div>
                  <div className="farmer-stat-content">
                    <div className="farmer-stat-label">This Season</div>
                    <div className="farmer-stat-value">850 kg</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Available Training
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming', status: 'available', duration: '2 hours' },
                  { title: 'Child Labor Prevention', status: 'available', duration: '1.5 hours' },
                  { title: 'Financial Management', status: 'completed', duration: '3 hours' },
                ].map((training, idx) => (
                  <div key={idx} className="training-item">
                    <div className="training-info">
                      <h4 className="training-title">{training.title}</h4>
                      <div className="training-meta">
                        <Clock className="icon-xs" />
                        <span>{training.duration}</span>
                      </div>
                    </div>
                    {training.status === 'completed' ? (
                      <div className="status-badge status-compliant">
                        <CheckCircle2 className="icon-xs" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button className="btn-primary btn-sm">
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                Pending Declarations
              </h3>
              <div className="declaration-list">
                {[
                  { type: 'Child Labor Declaration', due: '2024-12-15', status: 'pending' },
                  { type: 'Harvest Report', due: '2024-12-20', status: 'pending' },
                ].map((declaration, idx) => (
                  <div key={idx} className="declaration-item">
                    <div className="declaration-info">
                      <h4 className="declaration-title">{declaration.type}</h4>
                      <div className="declaration-meta">
                        <Calendar className="icon-xs" />
                        <span>Due: {new Date(declaration.due).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="btn-primary btn-sm">
                      <span>Submit</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'training' && (
          <div className="training-content">
            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Training Programs
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming Practices', description: 'Learn best practices for sustainable agriculture', duration: '2 hours', status: 'available' },
                  { title: 'Child Labor Prevention', description: 'Understanding child labor laws and prevention', duration: '1.5 hours', status: 'available' },
                  { title: 'Financial Literacy', description: 'Managing farm finances and income', duration: '3 hours', status: 'completed' },
                  { title: 'Market Access', description: 'Connecting with buyers and markets', duration: '1 hour', status: 'available' },
                ].map((training, idx) => (
                  <div key={idx} className="training-card">
                    <div className="training-card-header">
                      <BookOpen className="training-card-icon" />
                      <div className={`status-badge status-${training.status}`}>
                        {training.status === 'completed' ? <CheckCircle2 className="icon-xs" /> : <Clock className="icon-xs" />}
                        <span>{training.status}</span>
                      </div>
                    </div>
                    <h4 className="training-card-title">{training.title}</h4>
                    <p className="training-card-description">{training.description}</p>
                    <div className="training-card-footer">
                      <div className="training-card-meta">
                        <Clock className="icon-xs" />
                        <span>{training.duration}</span>
                      </div>
                      {training.status === 'available' && (
                        <button className="btn-primary btn-sm">
                          <span>Start Training</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'declarations' && (
          <div className="declarations-content">
            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                My Declarations
              </h3>
              <div className="declaration-list">
                {[
                  { type: 'Child Labor Declaration', date: '2024-12-01', status: 'submitted' },
                  { type: 'Harvest Report', date: '2024-11-15', status: 'submitted' },
                  { type: 'Child Labor Declaration', date: '2024-12-15', status: 'pending' },
                  { type: 'Harvest Report', date: '2024-12-20', status: 'pending' },
                ].map((declaration, idx) => (
                  <div key={idx} className="declaration-item">
                    <div className="declaration-info">
                      <h4 className="declaration-title">{declaration.type}</h4>
                      <div className="declaration-meta">
                        <Calendar className="icon-xs" />
                        <span>{new Date(declaration.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {declaration.status === 'submitted' ? (
                      <div className="status-badge status-compliant">
                        <CheckCircle2 className="icon-xs" />
                        <span>Submitted</span>
                      </div>
                    ) : (
                      <button className="btn-primary btn-sm">
                        <span>Submit</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'help' && (
          <div className="help-content">
            <div className="section-card">
              <h3 className="section-title">
                <Phone className="section-title-icon" />
                Need Help?
              </h3>
              <div className="help-actions">
                <button className="help-action-card">
                  <Phone className="help-action-icon" />
                  <div className="help-action-content">
                    <h4 className="help-action-title">Call Cooperative</h4>
                    <p className="help-action-desc">Contact your cooperative manager</p>
                  </div>
                  <ChevronRight className="icon-sm" />
                </button>
                
                <button className="help-action-card">
                  <MessageSquare className="help-action-icon" />
                  <div className="help-action-content">
                    <h4 className="help-action-title">Send Message</h4>
                    <p className="help-action-desc">Send a message to support</p>
                  </div>
                  <ChevronRight className="icon-sm" />
                </button>
                
                <button className="help-action-card">
                  <Video className="help-action-icon" />
                  <div className="help-action-content">
                    <h4 className="help-action-title">Training Videos</h4>
                    <p className="help-action-desc">Watch instructional videos</p>
                  </div>
                  <ChevronRight className="icon-sm" />
                </button>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Globe className="section-title-icon" />
                Language
              </h3>
              <div className="language-list">
                {['Baoule', 'Agni', 'Dioula', 'Français'].map((lang) => (
                  <button
                    key={lang}
                    className={`language-button ${language.toLowerCase() === lang.toLowerCase() ? 'language-button-active' : ''}`}
                    onClick={() => setLanguage(lang.toLowerCase())}
                  >
                    <span>{lang}</span>
                    {language.toLowerCase() === lang.toLowerCase() && (
                      <CheckCircle2 className="icon-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main App Component
export const IntelligenceApp = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  if (!userRole) {
    return <RoleSelector onSelectRole={setUserRole} />;
  }

  if (userRole === 'ermits_team') return <ERMITSTeamDashboard />;
  if (userRole === 'cooperative') return <CooperativeDashboard />;
  if (userRole === 'farmer') return <FarmerFieldApp />;

  return null;
};
