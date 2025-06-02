'use client';

interface ServerCardProps {
  title: string;
  subtitle: string;
  type: 'pvp' | 'pve';
  features: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  specialSections: Array<{
    title: string;
    items: string[];
  }>;
}

export default function ServerCard({ title, subtitle, type, features, specialSections }: ServerCardProps) {
  const colorScheme = type === 'pvp' 
    ? {
        border: 'border-red-500/50 hover:border-red-400',
        title: 'text-red-400',
        subtitle: 'text-red-200',
        icon: 'text-red-400',
        section: 'bg-red-900/30',
        sectionTitle: 'text-red-300'
      }
    : {
        border: 'border-blue-500/50 hover:border-blue-400',
        title: 'text-blue-400',
        subtitle: 'text-blue-200',
        icon: 'text-blue-400',
        section: 'bg-blue-900/30',
        sectionTitle: 'text-blue-300'
      };

  return (
    <div className={`bg-black/60 backdrop-blur-sm border ${colorScheme.border} rounded-xl p-8 shadow-2xl hover:scale-105 transition-all duration-300`}>
      <div className="text-center mb-6">
        <h3 className={`text-3xl font-bold ${colorScheme.title} mb-2`}>{title}</h3>
        <p className={colorScheme.subtitle}>{subtitle}</p>
      </div>
      
      <div className="space-y-3 text-sm md:text-base">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className={colorScheme.icon}>{feature.icon}</span>
            <span><strong>{feature.label}:</strong> {feature.value}</span>
          </div>
        ))}
        
        {specialSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={`mt-6 p-4 ${colorScheme.section} rounded-lg`}>
            <h4 className={`font-bold ${colorScheme.sectionTitle} mb-2`}>{section.title}</h4>
            {section.items.map((item, itemIndex) => (
              <p key={itemIndex} className="text-sm">{item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 