
interface StudentDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const StudentDashboardTabs = ({ activeTab, onTabChange }: StudentDashboardTabsProps) => {
  const tabs = [
    { id: 'courses', label: 'My Courses' },
    { id: 'browse', label: 'Browse Courses' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <div className="mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-4 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-lms-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
