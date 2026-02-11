import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StyleSheet, Dimensions, Image, TextInput,
  SafeAreaView, StatusBar, FlatList, Modal
} from 'react-native';

// ========================
// DESIGN SYSTEM
// ========================
const COLORS = {
  earth: {
    soil: '#3E2723',
    clay: '#5D4037',
    terracotta: '#D84315',
    wheat: '#F9A825',
    leaf: '#388E3C',
    forest: '#1B5E20',
    sky: '#0277BD',
    water: '#01579B',
  },
  status: {
    danger: '#C62828',
    warning: '#F57F17',
    success: '#2E7D32',
    info: '#1565C0',
  },
  neutral: {
    white: '#FFFFFF',
    cream: '#FFF8E1',
    gray: '#757575',
    darkGray: '#424242',
  }
};

const FONTS = {
  display: { fontFamily: 'System', fontWeight: '800' },
  heading: { fontFamily: 'System', fontWeight: '700' },
  body: { fontFamily: 'System', fontWeight: '400' },
  mono: { fontFamily: 'Courier', fontWeight: '500' },
};

// ========================
// MOCK DATA
// ========================
const MOCK_WEATHER = {
  current: { temp: 28, condition: 'Partly Cloudy', humidity: 72, rainfall: 0 },
  forecast: [
    { day: 'Mon', high: 31, low: 22, rain: 20, icon: '⛅' },
    { day: 'Tue', high: 29, low: 21, rain: 60, icon: '🌧️' },
    { day: 'Wed', high: 32, low: 23, rain: 10, icon: '☀️' },
    { day: 'Thu', high: 30, low: 22, rain: 40, icon: '⛈️' },
    { day: 'Fri', high: 28, low: 20, rain: 70, icon: '🌧️' },
  ]
};

const MOCK_MARKET_PRICES = [
  { crop: 'Cocoa', price: 2850, change: '+5.2%', trend: '📈', unit: 'XOF/kg' },
  { crop: 'Coffee', price: 3200, change: '-2.1%', trend: '📉', unit: 'XOF/kg' },
  { crop: 'Cashew', price: 1950, change: '+8.7%', trend: '📈', unit: 'XOF/kg' },
  { crop: 'Palm Oil', price: 1500, change: '+3.4%', trend: '📈', unit: 'XOF/L' },
];

const MOCK_COOPERATIVES = [
  { id: '1', name: 'SCAC Abidjan', region: 'Lagunes', members: 487, status: 'compliant', lastSync: '2 hrs ago' },
  { id: '2', name: 'COOPAGRI San-Pedro', region: 'Bas-Sassandra', members: 1203, status: 'warning', lastSync: '5 hrs ago' },
  { id: '3', name: 'UCODEC Daloa', region: 'Sassandra-Marahoué', members: 856, status: 'compliant', lastSync: '1 hr ago' },
];

const MOCK_COMPLIANCE_ALERTS = [
  { type: 'EUDR', message: 'GPS verification required for 23 farms', priority: 'high', cooperative: 'SCAC Abidjan' },
  { type: 'Child Labor', message: 'School enrollment documents pending', priority: 'medium', cooperative: 'COOPAGRI San-Pedro' },
  { type: 'Fair Trade', message: 'Annual audit scheduled Dec 15', priority: 'low', cooperative: 'UCODEC Daloa' },
];

const MOCK_TRENDS = [
  { title: 'Cocoa Demand Surge in EU', impact: 'Prices up 12% this month', action: 'Consider early harvest' },
  { title: 'EUDR Deadline Approaching', impact: '45 days until compliance required', action: 'Complete GPS mapping' },
  { title: 'Drought Risk in Bas-Sassandra', impact: 'Rainfall 30% below average', action: 'Implement water conservation' },
];

// ========================
// USER ROLES
// ========================
type UserRole = 'ermits_team' | 'cooperative' | 'farmer';

// ========================
// SHARED COMPONENTS
// ========================
const MetricCard = ({ icon, label, value, trend, color }: any) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <Text style={styles.metricIcon}>{icon}</Text>
    <View style={styles.metricContent}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {trend && <Text style={styles.metricTrend}>{trend}</Text>}
    </View>
  </View>
);

const WeatherCard = ({ weather }: any) => (
  <View style={styles.weatherCard}>
    <View style={styles.weatherHeader}>
      <Text style={styles.weatherTitle}>🌤️ Climate Intelligence</Text>
      <Text style={styles.weatherTemp}>{weather.current.temp}°C</Text>
    </View>
    <Text style={styles.weatherCondition}>{weather.current.condition}</Text>
    <View style={styles.weatherDetails}>
      <Text style={styles.weatherDetail}>💧 {weather.current.humidity}% Humidity</Text>
      <Text style={styles.weatherDetail}>🌧️ {weather.current.rainfall}mm Rain</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
      {weather.forecast.map((day: any, idx: number) => (
        <View key={idx} style={styles.forecastDay}>
          <Text style={styles.forecastDayName}>{day.day}</Text>
          <Text style={styles.forecastIcon}>{day.icon}</Text>
          <Text style={styles.forecastTemp}>{day.high}°</Text>
          <Text style={styles.forecastRain}>{day.rain}%</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const MarketPriceCard = ({ prices }: any) => (
  <View style={styles.marketCard}>
    <Text style={styles.sectionTitle}>💰 Market Prices</Text>
    {prices.map((item: any, idx: number) => (
      <View key={idx} style={styles.priceRow}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceCrop}>{item.crop}</Text>
          <Text style={styles.priceUnit}>{item.unit}</Text>
        </View>
        <View style={styles.priceValues}>
          <Text style={styles.priceAmount}>{item.price.toLocaleString()}</Text>
          <Text style={[
            styles.priceChange, 
            { color: item.change.startsWith('+') ? COLORS.status.success : COLORS.status.danger }
          ]}>
            {item.trend} {item.change}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const AlertBadge = ({ type, priority }: any) => {
  const colors: any = {
    high: COLORS.status.danger,
    medium: COLORS.status.warning,
    low: COLORS.status.info,
  };
  return (
    <View style={[styles.alertBadge, { backgroundColor: colors[priority] }]}>
      <Text style={styles.alertBadgeText}>{type}</Text>
    </View>
  );
};

// ========================
// ERMITS TEAM DASHBOARD
// ========================
const ERMITSTeamDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.earth.forest} />
      
      {/* Header */}
      <View style={styles.headerERMITS}>
        <View>
          <Text style={styles.headerTitle}>ERMITS Command</Text>
          <Text style={styles.headerSubtitle}>Managing 3,797 Cooperatives</Text>
        </View>
        <View style={styles.syncBadge}>
          <Text style={styles.syncText}>⚡ Live</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        {['overview', 'cooperatives', 'alerts', 'trends'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <View style={styles.metricsGrid}>
              <MetricCard 
                icon="🏢" 
                label="Active Cooperatives" 
                value="3,797" 
                trend="+12 this week"
                color={COLORS.earth.forest}
              />
              <MetricCard 
                icon="👨‍🌾" 
                label="Total Farmers" 
                value="524,203" 
                trend="+1,847 this month"
                color={COLORS.earth.leaf}
              />
              <MetricCard 
                icon="✅" 
                label="EUDR Compliant" 
                value="98.2%" 
                trend="+2.1% this month"
                color={COLORS.status.success}
              />
              <MetricCard 
                icon="⚠️" 
                label="Action Required" 
                value="127" 
                trend="23 urgent"
                color={COLORS.status.warning}
              />
            </View>

            {/* Weather Intelligence */}
            <WeatherCard weather={MOCK_WEATHER} />

            {/* Market Intelligence */}
            <MarketPriceCard prices={MOCK_MARKET_PRICES} />
          </>
        )}

        {selectedTab === 'cooperatives' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>📋 Cooperative Directory</Text>
            {MOCK_COOPERATIVES.map((coop) => (
              <TouchableOpacity key={coop.id} style={styles.coopCard}>
                <View style={styles.coopHeader}>
                  <Text style={styles.coopName}>{coop.name}</Text>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: coop.status === 'compliant' ? COLORS.status.success : COLORS.status.warning }
                  ]} />
                </View>
                <Text style={styles.coopRegion}>📍 {coop.region}</Text>
                <View style={styles.coopStats}>
                  <Text style={styles.coopStat}>👥 {coop.members} members</Text>
                  <Text style={styles.coopStat}>🔄 {coop.lastSync}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === 'alerts' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>🚨 Compliance Alerts</Text>
            {MOCK_COMPLIANCE_ALERTS.map((alert, idx) => (
              <View key={idx} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <AlertBadge type={alert.type} priority={alert.priority} />
                  <Text style={styles.alertCoop}>{alert.cooperative}</Text>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <TouchableOpacity style={styles.alertAction}>
                  <Text style={styles.alertActionText}>Take Action →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'trends' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>📊 Agricultural Trends</Text>
            {MOCK_TRENDS.map((trend, idx) => (
              <View key={idx} style={styles.trendCard}>
                <Text style={styles.trendTitle}>{trend.title}</Text>
                <Text style={styles.trendImpact}>Impact: {trend.impact}</Text>
                <View style={styles.trendAction}>
                  <Text style={styles.trendActionLabel}>Recommended Action:</Text>
                  <Text style={styles.trendActionText}>{trend.action}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ========================
// COOPERATIVE DASHBOARD
// ========================
const CooperativeDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.earth.leaf} />
      
      {/* Header */}
      <View style={styles.headerCoop}>
        <View>
          <Text style={styles.headerTitle}>SCAC Abidjan</Text>
          <Text style={styles.headerSubtitle}>487 Members • Lagunes Region</Text>
        </View>
        <View style={styles.complianceBadge}>
          <Text style={styles.complianceText}>✓ Compliant</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.tabBar}>
        {['dashboard', 'members', 'sales', 'compliance'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'dashboard' && (
          <>
            {/* Performance Metrics */}
            <View style={styles.metricsGrid}>
              <MetricCard 
                icon="💰" 
                label="Monthly Revenue" 
                value="€127,500" 
                trend="+18% vs last month"
                color={COLORS.earth.wheat}
              />
              <MetricCard 
                icon="📦" 
                label="Production" 
                value="23.4 tons" 
                trend="Cocoa, Coffee, Cashew"
                color={COLORS.earth.terracotta}
              />
            </View>

            {/* Weather */}
            <WeatherCard weather={MOCK_WEATHER} />

            {/* Market Prices */}
            <MarketPriceCard prices={MOCK_MARKET_PRICES} />

            {/* Quick Actions */}
            <View style={styles.actionsCard}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📸 Submit Harvest Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📍 Update GPS Coordinates</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>💬 Contact ERMITS Team</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {selectedTab === 'members' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>👨‍🌾 Member Directory</Text>
            <View style={styles.searchBar}>
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search members..." 
                placeholderTextColor={COLORS.neutral.gray}
              />
            </View>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>Farmer {i}</Text>
                  <Text style={styles.memberDetails}>Plot {i} • 2.3 hectares • Cocoa</Text>
                </View>
                <TouchableOpacity style={styles.memberAction}>
                  <Text style={styles.memberActionText}>View →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'sales' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>💰 Sales & Orders</Text>
            <View style={styles.salesSummary}>
              <View style={styles.salesStat}>
                <Text style={styles.salesStatLabel}>This Month</Text>
                <Text style={styles.salesStatValue}>€127,500</Text>
              </View>
              <View style={styles.salesStat}>
                <Text style={styles.salesStatLabel}>Pending Orders</Text>
                <Text style={styles.salesStatValue}>12</Text>
              </View>
            </View>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderBuyer}>International Buyer {i}</Text>
                  <Text style={styles.orderStatus}>Pending</Text>
                </View>
                <Text style={styles.orderDetails}>5 tons Cocoa • €12,500</Text>
                <Text style={styles.orderDate}>Delivery: Dec 15, 2024</Text>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'compliance' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>✅ Compliance Status</Text>
            <View style={styles.complianceCard}>
              <View style={styles.complianceRow}>
                <Text style={styles.complianceLabel}>EUDR Certification</Text>
                <Text style={styles.complianceStatus}>✅ Valid</Text>
              </View>
              <View style={styles.complianceRow}>
                <Text style={styles.complianceLabel}>Fair Trade</Text>
                <Text style={styles.complianceStatus}>✅ Valid</Text>
              </View>
              <View style={styles.complianceRow}>
                <Text style={styles.complianceLabel}>Child Labor Verification</Text>
                <Text style={styles.complianceStatus}>⚠️ Update Required</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ========================
// FARMER FIELD APP
// ========================
const FarmerFieldApp = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [language, setLanguage] = useState('baoule');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.earth.terracotta} />
      
      {/* Simple Header */}
      <View style={styles.headerFarmer}>
        <View>
          <Text style={styles.headerTitleFarmer}>🌾 AgroSoluce</Text>
          <Text style={styles.headerSubtitleFarmer}>Offline Mode • Baoule</Text>
        </View>
        <TouchableOpacity style={styles.voiceButton}>
          <Text style={styles.voiceIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Large Icon Navigation */}
      <View style={styles.farmerNav}>
        {[
          { key: 'home', icon: '🏠', label: 'Home' },
          { key: 'weather', icon: '🌤️', label: 'Weather' },
          { key: 'prices', icon: '💰', label: 'Prices' },
          { key: 'help', icon: '📞', label: 'Help' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.farmerTab, selectedTab === tab.key && styles.farmerTabActive]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={styles.farmerTabIcon}>{tab.icon}</Text>
            <Text style={styles.farmerTabLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'home' && (
          <>
            {/* Voice Greeting */}
            <View style={styles.greetingCard}>
              <Text style={styles.greetingText}>🎙️ "Ani sɔrɔ! Welcome!"</Text>
              <Text style={styles.greetingSubtext}>Tap microphone to use voice commands</Text>
            </View>

            {/* Today's Tasks */}
            <View style={styles.tasksCard}>
              <Text style={styles.sectionTitleFarmer}>📋 Today's Tasks</Text>
              {[
                { task: 'Check cocoa pods', icon: '🍫', time: 'Morning' },
                { task: 'Water young plants', icon: '💧', time: 'Afternoon' },
                { task: 'Report harvest', icon: '📸', time: 'Evening' },
              ].map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.taskItem}>
                  <Text style={styles.taskIcon}>{item.icon}</Text>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskText}>{item.task}</Text>
                    <Text style={styles.taskTime}>{item.time}</Text>
                  </View>
                  <View style={styles.taskCheck} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Stats */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🌱</Text>
                <Text style={styles.statValue}>2.3 ha</Text>
                <Text style={styles.statLabel}>Farm Size</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🍫</Text>
                <Text style={styles.statValue}>850 kg</Text>
                <Text style={styles.statLabel}>This Season</Text>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'weather' && (
          <>
            {/* Simple Weather */}
            <View style={styles.weatherCardFarmer}>
              <Text style={styles.weatherIconLarge}>⛅</Text>
              <Text style={styles.weatherTempLarge}>28°C</Text>
              <Text style={styles.weatherConditionLarge}>Partly Cloudy</Text>
              
              <View style={styles.weatherDetailsFarmer}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>💧</Text>
                  <Text style={styles.weatherDetailText}>72%</Text>
                  <Text style={styles.weatherDetailLabel}>Humidity</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailIcon}>🌧️</Text>
                  <Text style={styles.weatherDetailText}>0mm</Text>
                  <Text style={styles.weatherDetailLabel}>Rain</Text>
                </View>
              </View>
            </View>

            {/* Voice Alert */}
            <View style={styles.alertCardFarmer}>
              <Text style={styles.alertIconFarmer}>⚠️</Text>
              <Text style={styles.alertTextFarmer}>Rain expected Tuesday</Text>
              <Text style={styles.alertSubtextFarmer}>Good time to plant</Text>
            </View>

            {/* Week Forecast */}
            <View style={styles.forecastCardFarmer}>
              <Text style={styles.sectionTitleFarmer}>📅 This Week</Text>
              {MOCK_WEATHER.forecast.map((day, idx) => (
                <View key={idx} style={styles.forecastRowFarmer}>
                  <Text style={styles.forecastIconFarmer}>{day.icon}</Text>
                  <Text style={styles.forecastDayFarmer}>{day.day}</Text>
                  <Text style={styles.forecastTempFarmer}>{day.high}°/{day.low}°</Text>
                  <Text style={styles.forecastRainFarmer}>💧{day.rain}%</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'prices' && (
          <>
            <View style={styles.pricesCardFarmer}>
              <Text style={styles.sectionTitleFarmer}>💰 Today's Prices</Text>
              {MOCK_MARKET_PRICES.map((item, idx) => (
                <View key={idx} style={styles.priceRowFarmer}>
                  <View style={styles.priceLeftFarmer}>
                    <Text style={styles.priceCropFarmer}>{item.crop}</Text>
                    <Text style={styles.priceUnitFarmer}>{item.unit}</Text>
                  </View>
                  <View style={styles.priceRightFarmer}>
                    <Text style={styles.priceAmountFarmer}>{item.price.toLocaleString()}</Text>
                    <Text style={[
                      styles.priceChangeFarmer,
                      { color: item.change.startsWith('+') ? COLORS.status.success : COLORS.status.danger }
                    ]}>
                      {item.change}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Voice Explanation */}
            <TouchableOpacity style={styles.voiceExplainButton}>
              <Text style={styles.voiceExplainIcon}>🎙️</Text>
              <Text style={styles.voiceExplainText}>Tap to hear price explanation</Text>
            </TouchableOpacity>
          </>
        )}

        {selectedTab === 'help' && (
          <>
            <View style={styles.helpCard}>
              <Text style={styles.sectionTitleFarmer}>📞 Need Help?</Text>
              
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonIcon}>☎️</Text>
                <Text style={styles.helpButtonText}>Call Cooperative</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonIcon}>💬</Text>
                <Text style={styles.helpButtonText}>Send Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonIcon}>📹</Text>
                <Text style={styles.helpButtonText}>Watch Training Videos</Text>
              </TouchableOpacity>
            </View>

            {/* Language Selector */}
            <View style={styles.languageCard}>
              <Text style={styles.sectionTitleFarmer}>🌍 Language</Text>
              {['Baoule', 'Agni', 'Dioula', 'Français'].map((lang) => (
                <TouchableOpacity 
                  key={lang} 
                  style={[
                    styles.languageButton,
                    language.toLowerCase() === lang.toLowerCase() && styles.languageButtonActive
                  ]}
                >
                  <Text style={styles.languageButtonText}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ========================
// MAIN APP WITH ROLE SELECTOR
// ========================
const AgroSoluceIntelligenceApp = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(true);

  if (showRoleSelector) {
    return (
      <View style={styles.roleSelectorContainer}>
        <View style={styles.roleSelectorContent}>
          <Text style={styles.roleSelectorTitle}>AgroSoluce Intelligence™</Text>
          <Text style={styles.roleSelectorSubtitle}>Select Your Role</Text>
          
          <TouchableOpacity
            style={[styles.roleButton, styles.roleButtonERMITS]}
            onPress={() => {
              setUserRole('ermits_team');
              setShowRoleSelector(false);
            }}
          >
            <Text style={styles.roleButtonIcon}>🎯</Text>
            <Text style={styles.roleButtonTitle}>ERMITS Team</Text>
            <Text style={styles.roleButtonDesc}>Command Center • 3,797 Cooperatives</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.roleButtonCoop]}
            onPress={() => {
              setUserRole('cooperative');
              setShowRoleSelector(false);
            }}
          >
            <Text style={styles.roleButtonIcon}>🏢</Text>
            <Text style={styles.roleButtonTitle}>Cooperative</Text>
            <Text style={styles.roleButtonDesc}>Management Dashboard • Members & Sales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.roleButtonFarmer]}
            onPress={() => {
              setUserRole('farmer');
              setShowRoleSelector(false);
            }}
          >
            <Text style={styles.roleButtonIcon}>👨‍🌾</Text>
            <Text style={styles.roleButtonTitle}>Farmer</Text>
            <Text style={styles.roleButtonDesc}>Field App • Voice Guided • Offline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (userRole === 'ermits_team') return <ERMITSTeamDashboard />;
  if (userRole === 'cooperative') return <CooperativeDashboard />;
  if (userRole === 'farmer') return <FarmerFieldApp />;

  return null;
};

// ========================
// STYLES
// ========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.cream,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // Role Selector
  roleSelectorContainer: {
    flex: 1,
    backgroundColor: COLORS.earth.soil,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  roleSelectorContent: {
    width: '100%',
    maxWidth: 400,
  },
  roleSelectorTitle: {
    ...FONTS.display,
    fontSize: 32,
    color: COLORS.neutral.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  roleSelectorSubtitle: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.earth.wheat,
    textAlign: 'center',
    marginBottom: 40,
  },
  roleButton: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 3,
  },
  roleButtonERMITS: {
    borderColor: COLORS.earth.forest,
  },
  roleButtonCoop: {
    borderColor: COLORS.earth.leaf,
  },
  roleButtonFarmer: {
    borderColor: COLORS.earth.terracotta,
  },
  roleButtonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleButtonTitle: {
    ...FONTS.heading,
    fontSize: 24,
    color: COLORS.earth.soil,
    marginBottom: 8,
  },
  roleButtonDesc: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
    textAlign: 'center',
  },

  // Headers
  headerERMITS: {
    backgroundColor: COLORS.earth.forest,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCoop: {
    backgroundColor: COLORS.earth.leaf,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerFarmer: {
    backgroundColor: COLORS.earth.terracotta,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.heading,
    fontSize: 24,
    color: COLORS.neutral.white,
  },
  headerSubtitle: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.cream,
    marginTop: 4,
  },
  headerTitleFarmer: {
    ...FONTS.heading,
    fontSize: 28,
    color: COLORS.neutral.white,
  },
  headerSubtitleFarmer: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.cream,
    marginTop: 4,
  },
  syncBadge: {
    backgroundColor: COLORS.status.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  syncText: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  complianceBadge: {
    backgroundColor: COLORS.status.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  complianceText: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: COLORS.neutral.white,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 28,
  },

  // Navigation
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '30',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.earth.forest,
  },
  tabText: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
  },
  tabTextActive: {
    ...FONTS.heading,
    color: COLORS.earth.forest,
  },

  // Farmer Navigation
  farmerNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral.white,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '30',
  },
  farmerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  farmerTabActive: {
    backgroundColor: COLORS.earth.terracotta + '20',
  },
  farmerTabIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  farmerTabLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.earth.soil,
  },

  // Metrics
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
    marginBottom: 4,
  },
  metricValue: {
    ...FONTS.heading,
    fontSize: 24,
    marginBottom: 4,
  },
  metricTrend: {
    ...FONTS.body,
    fontSize: 11,
    color: COLORS.neutral.gray,
  },

  // Weather Card
  weatherCard: {
    backgroundColor: COLORS.earth.sky,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherTitle: {
    ...FONTS.heading,
    fontSize: 18,
    color: COLORS.neutral.white,
  },
  weatherTemp: {
    ...FONTS.display,
    fontSize: 40,
    color: COLORS.neutral.white,
  },
  weatherCondition: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.neutral.cream,
    marginBottom: 16,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weatherDetail: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.white,
  },
  forecastScroll: {
    marginTop: 8,
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: COLORS.neutral.white + '20',
    padding: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  forecastDayName: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  forecastIcon: {
    fontSize: 28,
    marginVertical: 8,
  },
  forecastTemp: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  forecastRain: {
    ...FONTS.body,
    fontSize: 11,
    color: COLORS.neutral.cream,
  },

  // Market Card
  marketCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...FONTS.heading,
    fontSize: 18,
    color: COLORS.earth.soil,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '20',
  },
  priceInfo: {
    flex: 1,
  },
  priceCrop: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
  },
  priceUnit: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },
  priceValues: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    ...FONTS.mono,
    fontSize: 18,
    color: COLORS.earth.soil,
  },
  priceChange: {
    ...FONTS.body,
    fontSize: 12,
    fontWeight: '600',
  },

  // Cooperative List
  listContainer: {
    marginBottom: 16,
  },
  coopCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coopName: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  coopRegion: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
    marginBottom: 8,
  },
  coopStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coopStat: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },

  // Alerts
  alertCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.danger,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertBadgeText: {
    ...FONTS.body,
    fontSize: 11,
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  alertCoop: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },
  alertMessage: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.earth.soil,
    marginBottom: 12,
  },
  alertAction: {
    alignSelf: 'flex-start',
  },
  alertActionText: {
    ...FONTS.heading,
    fontSize: 14,
    color: COLORS.earth.forest,
  },

  // Trends
  trendCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendTitle: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
    marginBottom: 8,
  },
  trendImpact: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
    marginBottom: 12,
  },
  trendAction: {
    backgroundColor: COLORS.earth.wheat + '20',
    padding: 12,
    borderRadius: 8,
  },
  trendActionLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
    marginBottom: 4,
  },
  trendActionText: {
    ...FONTS.heading,
    fontSize: 14,
    color: COLORS.earth.soil,
  },

  // Actions
  actionsCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: COLORS.earth.leaf,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.neutral.white,
    textAlign: 'center',
  },

  // Search
  searchBar: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.neutral.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral.gray + '30',
    ...FONTS.body,
    fontSize: 14,
  },

  // Members
  memberCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
    marginBottom: 4,
  },
  memberDetails: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },
  memberAction: {},
  memberActionText: {
    ...FONTS.heading,
    fontSize: 14,
    color: COLORS.earth.leaf,
  },

  // Sales
  salesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  salesStat: {
    alignItems: 'center',
  },
  salesStatLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
    marginBottom: 8,
  },
  salesStatValue: {
    ...FONTS.display,
    fontSize: 28,
    color: COLORS.earth.wheat,
  },
  orderCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderBuyer: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
  },
  orderStatus: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.status.warning,
    fontWeight: '600',
  },
  orderDetails: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
    marginBottom: 4,
  },
  orderDate: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },

  // Compliance
  complianceCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '20',
  },
  complianceLabel: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.earth.soil,
  },
  complianceStatus: {
    ...FONTS.heading,
    fontSize: 14,
  },

  // Farmer Specific
  greetingCard: {
    backgroundColor: COLORS.earth.terracotta,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  greetingText: {
    ...FONTS.heading,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  greetingSubtext: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.cream,
  },

  tasksCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitleFarmer: {
    ...FONTS.heading,
    fontSize: 20,
    color: COLORS.earth.soil,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '20',
  },
  taskIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.earth.soil,
  },
  taskTime: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
    marginTop: 4,
  },
  taskCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral.gray,
  },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  statValue: {
    ...FONTS.display,
    fontSize: 24,
    color: COLORS.earth.soil,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },

  weatherCardFarmer: {
    backgroundColor: COLORS.earth.sky,
    borderRadius: 20,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  weatherIconLarge: {
    fontSize: 80,
    marginBottom: 16,
  },
  weatherTempLarge: {
    ...FONTS.display,
    fontSize: 56,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  weatherConditionLarge: {
    ...FONTS.heading,
    fontSize: 20,
    color: COLORS.neutral.cream,
    marginBottom: 24,
  },
  weatherDetailsFarmer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  weatherDetailItem: {
    alignItems: 'center',
  },
  weatherDetailIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  weatherDetailText: {
    ...FONTS.heading,
    fontSize: 18,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  weatherDetailLabel: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.cream,
  },

  alertCardFarmer: {
    backgroundColor: COLORS.status.warning,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertIconFarmer: {
    fontSize: 40,
    marginBottom: 12,
  },
  alertTextFarmer: {
    ...FONTS.heading,
    fontSize: 20,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  alertSubtextFarmer: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.cream,
  },

  forecastCardFarmer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
  },
  forecastRowFarmer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '20',
  },
  forecastIconFarmer: {
    fontSize: 32,
    width: 50,
  },
  forecastDayFarmer: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
    flex: 1,
  },
  forecastTempFarmer: {
    ...FONTS.mono,
    fontSize: 16,
    color: COLORS.earth.soil,
    width: 80,
  },
  forecastRainFarmer: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.neutral.gray,
    width: 60,
  },

  pricesCardFarmer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceRowFarmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.gray + '20',
  },
  priceLeftFarmer: {
    flex: 1,
  },
  priceCropFarmer: {
    ...FONTS.heading,
    fontSize: 18,
    color: COLORS.earth.soil,
    marginBottom: 4,
  },
  priceUnitFarmer: {
    ...FONTS.body,
    fontSize: 12,
    color: COLORS.neutral.gray,
  },
  priceRightFarmer: {
    alignItems: 'flex-end',
  },
  priceAmountFarmer: {
    ...FONTS.mono,
    fontSize: 20,
    color: COLORS.earth.soil,
    marginBottom: 4,
  },
  priceChangeFarmer: {
    ...FONTS.heading,
    fontSize: 14,
  },

  voiceExplainButton: {
    backgroundColor: COLORS.earth.terracotta,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceExplainIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  voiceExplainText: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.neutral.white,
  },

  helpCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: COLORS.earth.leaf,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  helpButtonText: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.neutral.white,
  },

  languageCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
  },
  languageButton: {
    backgroundColor: COLORS.neutral.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: COLORS.earth.terracotta + '20',
    borderColor: COLORS.earth.terracotta,
  },
  languageButtonText: {
    ...FONTS.heading,
    fontSize: 16,
    color: COLORS.earth.soil,
    textAlign: 'center',
  },
});

export default AgroSoluceIntelligenceApp;
