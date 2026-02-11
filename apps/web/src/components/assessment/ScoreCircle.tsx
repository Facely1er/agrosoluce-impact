interface ScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export function ScoreCircle({ score, size = 'large' }: ScoreCircleProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const strokeWidth = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const radius = size === 'small' ? 28 : size === 'medium' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a'; // green-600
    if (score >= 60) return '#2563eb'; // blue-600
    return '#ea580c'; // orange-600
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto mb-4`}>
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className={`font-bold ${textSizeClasses[size]} ${getScoreColorClass(score)}`}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}

